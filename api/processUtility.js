

module.exports = (function() {

	function addMinute(date, minutes) {
		return new Date(date.getTime() + minutes*60000);
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
		// add a end_at property
		processList.forEach( function(p) {
			p.end_at = addMinute(p.start_at, p.duration);
		});

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
		calcDuration: calcDuration,
		calcSumOfDuration: calcSumOfDuration,
		addMinute: addMinute
	};

})();



