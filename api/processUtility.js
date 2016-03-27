

module.exports = (function() {

	function addMinutes(date, minutes) {
		return new Date(date.getTime() + minutes*60000);
	}


	function newDuration(process) {
		return { id:process.id, 
						 process_name: process.process_name, 
						 start_at: process.start_at,
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

	function calcDuration(processList) {
		// sort by process_name
		processList.sort( function(p1, p2) {
			
		});


		// add a end_at property
		processList.forEach( function(p) {
			p.end_at = addMinutes(p.start_at, p.duration);
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

		return durations;
	}
	

	return {
		calcDuration: calcDuration
	};

})();



