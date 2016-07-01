

module.exports = (function() {

	function addMinute(date, minutes) {
		return new Date(date.getTime() + minutes*60000);
	}

	function mongoDateToJsDate(sDate) {
		return new Date(sDate);
	}

	function newDuration(process) {
		return { start_at: process.start_at,
						 end_at: process.end_at,
						};
	}

	function overlap(p1, p2) {
		if (p1.end_at < p2.start_at) {
			return false;
		}
		if (p2.end_at < p1.start_at) {
			return false;
		}
		return true;
	}

	function maxDate(d1, d2) {
		if (d1 < d2) {
			return d2;
		} else {
			return d1;
		}
	}

	function minDate(d1, d2) {
		if (d1 < d2) {
			return d1;
		} else {
			return d2;
		}
	}

	// add a end_at property
	function setEndAt(process) {
		if (Array.isArray(process)) {
			process.forEach( function(p) {
				p.end_at = addMinute(p.start_at, p.duration);
			});
		}
		else {
			// simple object
			process.end_at = addMinute(process.start_at, process.duration);
		}
	}

	function setDuration(process) {
		process.duration = Math.round( (process.end_at - process.start_at) / 60000 );
	}

	function isOverlapped(p1, p2) {
		//  /---p1---\
		//       \------p2----/
		if (p2.start_at >= p1.start_at  &&  p2.start_at <= p1.end_at) {
			return true;
		}
		//        	/---p1---\
		//    \------p2----/
		if (p1.start_at >= p2.start_at  &&  p1.start_at <= p2.end_at) {
			return true;
		}
		return false;
	} 

	function combineProcess(result, p2) {
		if (isOverlapped(result, p2)) {
			if (result.start_at > p2.start_at) {
				result.start_at = p2.start_at;
			}
			if (result.end_at < p2.end_at) {
				result.end_at = p2.end_at;
			}
			return true;
		}
		else {
			return false;
		}
	}

	function combineToProcessList(result, p2) {
		var combined = false;
		var finish = false;
		for (var i=0; !finish &&  i<result.length; i++) {
			if (!combined) {
				if (combineProcess(result[i], p2)) {
					combined = true;
				}
			}
			else {
				finish = true;
				// look if we should combine it with the previous process
				if (isOverlapped(result[i], p2)) {
					// combine with the previous
					combineProcess(result[i-1], result[i]);
					// and remove it
					result.splice(i, 1);
				}
			}
		}
		if (!combined) {
			result.push(p2);
		}
	}

	function getCompressedProcessList(processList) {
		setEndAt(processList);

		// sort by process_name
		processList.sort( function(p1, p2) {
			if (p1.start_at < p2.start_at) {
				return -1;
			}
			if (p1.start_at > p2.start_at) {
				return 1;
			}
			return 0;
		});
		

		var result = [];
		processList.forEach( function(p) {
			var len = result.length;
			if (len == 0) {
				result.push(p);
			}
			else {
				if (!combineProcess(result[len-1], p)) {
					result.push(p);
				}
			}
		});

		result.forEach(function(p) {
			setDuration(p);
		})

		return result;
	}


	function getProcessListDuration(processList) {
		var result = getCompressedProcessList(processList);
		var duration = 0.0;
		result.forEach( function(r) {
			duration += r.duration;
		});
		return duration;
	}


	function calcDuration(processList) {
		// sort by process_name
		processList.sort( function(p1, p2) {
			if (p1.process_name < p2.process_name) {
				return -1;
			}
			if (p1.process_name > p2.process_name) {
				return 1;
			}
			return 0;
		});

		var ids = [];
		processList.forEach( function(p) {
			if (ids.indexOf(p.id) < 0) {
				ids.push(p.id);
			}
		});

		var durations = [];
		ids.forEach( function(id) {
			var listOfOneProcess = processList.filter( function(p) {
				return p.id === id;
			});
			var sumDuration = calcSumOfDuration(listOfOneProcess);
			durations.push( {
				id: listOfOneProcess[0].id,
				process_name: listOfOneProcess[0].process_name,
				start_at: sumDuration.start_at,
				end_at: sumDuration.end_at,
				duration: sumDuration.duration || 0,
			});
		});

		return durations;
	}


	function calcSumOfDuration(processList) {
		setEndAt(processList);
		// sort by start_at
		processList.sort( function(a,b) {
			if (a.start_at < b.start_at) {
				return -1;
			}
			if (a.start_at > b.start_at) {
				return 1;
			}
			return 0;
		});

		// combine overlapping processes to one 
		var durations = [];
		processList.forEach( function(p) {
			if (durations.length === 0  ||  !overlap(durations[durations.length-1], p) ) {
				durations.push(newDuration(p));
			}
			else {
				// overlap
				durations[durations.length-1].end_at = maxDate(
						durations[durations.length-1].end_at,
						p.end_at);
			}
		});

		// recalc duration
		durations.forEach( function(d) {
			d.duration = Math.round( (d.end_at - d.start_at) / 60000 );
		});

		var sumDuration = 0;
		var minStartAt, maxEndAt;
		durations.forEach(function(d) {
			sumDuration += d.duration;
			if (!minStartAt) {
					minStartAt = d.start_at;	
			} else {
					minStartAt = minDate(minStartAt, d.start_at);
			}
			if (!maxEndAt) {
				maxEndAt = d.end_at;
			} else {
				maxEndAt = maxDate(maxEndAt, d.end_at);
			}
		});
		return { 
			duration: sumDuration,
			start_at: minStartAt,
			end_at: maxEndAt
		};
	}
	


	return {
		isOverlapped: isOverlapped,
		setEndAt: setEndAt,
		combineProcess: combineProcess,
		combineToProcessList: combineToProcessList,
		getCompressedProcessList: getCompressedProcessList,
		getProcessListDuration: getProcessListDuration,

		calcDuration: calcDuration,
		calcSumOfDuration: calcSumOfDuration,
		mongoDateToJsDate: mongoDateToJsDate
	};

})();



