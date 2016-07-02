

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

	function getDateWithoutTime(dt) {
		return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
	}

	function dateEqual(dt1, dt2) {
		return dt1.getTime() === dt2.getTime();
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


	function sortListByStartAt(processList) {
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
	}

	function getCompressedProcessList(processList) {
		setEndAt(processList);

		sortListByStartAt(processList);		

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


	function getProcessDuration(processList) {
		var result = getCompressedProcessList(processList);
		var duration = 0.0;
		result.forEach( function(r) {
			duration += r.duration;
		});
		return duration;
	}


	function getProcessDurationGroupedByDate(processList) {
		sortListByStartAt(processList);

		// list of dates (without time) and their process items
		// array-element =  { date: xy,   process:[...] }
		var dateList = [];

		processList.forEach( function(p) {
			dt = getDateWithoutTime(p.start_at);
			if (dateList.length == 0) {
				dateList.push({date:dt, process: [p]});
			}
			else {
				if (  dateEqual(dt, dateList[ dateList.length-1 ].date) ) {
					// same date   
					// append to list array
					dateList[ dateList.length-1 ].process.push(p);
				}
				else {
					// new date
					dateList.push({date:dt, process: [p]});
				}
			}
		});

		// now get the duration of each date
		var result = [];
		dateList.forEach(function(dp) {
			result.push( { date: dp.date, 
						   duration: getProcessDuration(dp.process)});
		})
		return result;
	}

	return {
		isOverlapped: isOverlapped,
		setEndAt: setEndAt,
		combineProcess: combineProcess,
		combineToProcessList: combineToProcessList,
		getCompressedProcessList: getCompressedProcessList,
		getProcessDuration: getProcessDuration,
		getProcessDurationGroupedByDate: getProcessDurationGroupedByDate,

		mongoDateToJsDate: mongoDateToJsDate
	};

})();



