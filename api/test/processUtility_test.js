
var assert = require('assert');

var processUtility = require('../processUtility');

describe('processDuration', function() {

	describe('calcDuration', function() {
		it ('overlap', function() {
			var oIn = [ 
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 15), duration:14 },
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:6 },
			];

			var oOut = processUtility.calcDuration(oIn);
			assert.equal(oOut.length, 1);
			assert.equal(oOut[0].id, 4711);
			assert.equal(oOut[0].process_name, 'javaw');
			assert.equal(oOut[0].duration, 19);
		});

		it ('not overlap', function() {
			var oIn = [ 
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 25), duration:14 },
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:6 },
			];

			var oOut = processUtility.calcDuration(oIn);
			assert.equal(oOut.length, 2);
			assert.equal(oOut[0].id, 4711);
			assert.equal(oOut[1].id, 4711);
			assert.equal(oOut[0].duration, 6);
			assert.equal(oOut[1].duration, 14);
		});

		xit ('different processes - overlap', function() {
			var oIn = [ 
			{ id:4711, process_name: 'cmd', start_at: new Date(2016, 2, 2, 6, 15), duration:14 },
			{ id:4712, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:6 },
			];

			var oOut = processUtility.calcDuration(oIn);
			assert.equal(oOut.length, 2);
			assert.equal(oOut[0].id, 4711);
			assert.equal(oOut[0].process_name, 'javaw');
			assert.equal(oOut[0].duration, 19);
		});

	});



});