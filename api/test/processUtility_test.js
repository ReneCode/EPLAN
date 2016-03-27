
var assert = require('assert');

var processUtility = require('../processUtility');

describe('processDuration', function() {

	describe('calcDuration', function() {
		it ('overlap', function() {
			var oIn = [ 
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 15), duration:14 },
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:7 },
			];

			var oOut = processUtility.calcDuration(oIn);
			assert.equal(oOut.length, 1);
			assert.equal(oOut[0].id, 4711);
			assert.equal(oOut[0].process_name, 'javaw');
			assert.equal(oOut[0].duration, 19);
			assert.deepEqual(oOut[0].start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(oOut[0].end_at, new Date(2016, 2, 2, 6, 29));
		});

		it ('not overlap', function() {

			var oIn = [ 
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 25), duration:14 },
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:6 },
			];

			var oOut = processUtility.calcDuration(oIn);
			assert.equal(oOut.length, 1);
			assert.equal(oOut[0].id, 4711);
			assert.equal(oOut[0].duration, 20);
			assert.deepEqual(oOut[0].start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(oOut[0].end_at, new Date(2016, 2, 2, 6, 39));
		});

		it ('different processes - overlap', function() {
			var oIn = [ 
			{ id:4711, process_name: 'cmd', start_at: new Date(2016, 2, 2, 6, 15), duration:14 },
			{ id:4712, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:7 },
			{ id:4712, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 15), duration:10 },
			{ id:4713, process_name: 'abc', start_at: new Date(2016, 2, 2, 6, 10), duration:14 }
			];

			var oOut = processUtility.calcDuration(oIn);
			assert.equal(oOut.length, 3);
			assert.equal(oOut[0].id, 4713);
			assert.equal(oOut[0].process_name, 'abc');
			assert.equal(oOut[0].duration, 14);
			assert.equal(oOut[2].id, 4712);
			assert.equal(oOut[2].duration, 15);
			assert.deepEqual(oOut[2].start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(oOut[2].end_at, new Date(2016, 2, 2, 6, 25));

		});

	});



});