
var assert = require('assert');

var processUtility = require('../processUtility');

describe('processUtility', function() {

	describe('basic methods', function() {
		it ('convert correct date', function() {
			var strDate = "2016-03-26T17:48:44.000Z";
			var dt = processUtility.mongoDateToJsDate(strDate);
			assert.equal(2016, dt.getUTCFullYear());
			assert.equal(3, dt.getUTCMonth()+1);
			assert.equal(26, dt.getUTCDate());
			assert.equal(17, dt.getUTCHours());
			assert.equal(48, dt.getUTCMinutes());
			assert.equal(44, dt.getUTCSeconds());
		});

		it ('set end_at property', function() {
			var data = [ 
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:1 },
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:0.5 },
			{ id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:0.75 },
			];

			processUtility.setEndAt(data);
			assert.deepEqual(new Date(2016, 2, 2, 6, 11), data[0].end_at); 
			assert.deepEqual(new Date(2016, 2, 2, 6, 10, 30), data[1].end_at); 
			assert.deepEqual(new Date(2016, 2, 2, 6, 10, 45), data[2].end_at); 
		});

		it ('isOverlapped', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:10 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 12), duration:1 };
			var p3 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 5), duration:6 };
			var p4 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 5), duration:7 };
			processUtility.setEndAt(p1);	//    10 .............. 20
			processUtility.setEndAt(p2);	//          12 ... 13
			processUtility.setEndAt(p3);    // 5 .. 11
			processUtility.setEndAt(p4);    // 5 ....   12

			assert.equal(processUtility.isOverlapped(p1, p2), true);
			assert.equal(processUtility.isOverlapped(p1, p3), true);
			assert.equal(processUtility.isOverlapped(p2, p3), false);
			assert.equal(processUtility.isOverlapped(p2, p4), true);		// same date (12)
		});

		it ('combine two overlapping processes p1 < p2', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:10 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 12), duration:10 };
			processUtility.setEndAt(p1);	//    10 .............. 20
			processUtility.setEndAt(p2);	//          12 ............. 22

			var ret = processUtility.combineProcess(p1, p2);
			assert.equal(true, ret);
			assert.deepEqual(p1.start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(p1.end_at, p2.end_at);
		});

		it ('combine two overlapping processes p1 > p2', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:10 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 5), duration:6 };
			processUtility.setEndAt(p1);	//    10 .............. 20
			processUtility.setEndAt(p2);	// 5 ......11

			var ret = processUtility.combineProcess(p1, p2);
			assert.equal(true, ret);
			assert.deepEqual(p1.start_at, new Date(2016, 2, 2, 6, 5));
			assert.deepEqual(p1.end_at, new Date(2016, 2, 2, 6, 20));
		});


		it ('combine two not overlapping processes', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:10 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 22), duration:10 };
			processUtility.setEndAt(p1);	//    10 .............. 20
			processUtility.setEndAt(p2);	//                           22 ............. 32

			var ret = processUtility.combineProcess(p1, p2);
			assert.equal(false, ret);
			assert.deepEqual(p1.start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(p1.end_at, new Date(2016, 2, 2, 6, 20));
		});


		it ('combine to processList simple', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:10 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 12), duration:10 };
			var p3 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 5), duration:6 };
			var p4 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 30), duration:5 };
			processUtility.setEndAt(p1);	//    10 .............. 20
			processUtility.setEndAt(p2);	//          12 ............ 22
			processUtility.setEndAt(p3);    // 5 .. 11
			processUtility.setEndAt(p4);    //                              30 .... 35

			var result = [];
			processUtility.combineToProcessList(result, p1);
			assert.deepEqual(result.length, 1);
			assert.deepEqual(result[0].start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(result[0].end_at, new Date(2016, 2, 2, 6, 20));

			processUtility.combineToProcessList(result, p2);
			assert.deepEqual(result.length, 1);
			assert.deepEqual(result[0].start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(result[0].end_at, new Date(2016, 2, 2, 6, 22));
			
			processUtility.combineToProcessList(result, p3);
			assert.deepEqual(result.length, 1);
			assert.deepEqual(result[0].start_at, new Date(2016, 2, 2, 6, 5));
			assert.deepEqual(result[0].end_at, new Date(2016, 2, 2, 6, 22));

			processUtility.combineToProcessList(result, p4);
			assert.deepEqual(result.length, 2);
			assert.deepEqual(result[0].start_at, new Date(2016, 2, 2, 6, 5));
			assert.deepEqual(result[0].end_at, new Date(2016, 2, 2, 6, 22));

			assert.deepEqual(result[1].start_at, new Date(2016, 2, 2, 6, 30));
			assert.deepEqual(result[1].end_at, new Date(2016, 2, 2, 6, 35));
		})

		it ('combine to processList shrink', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:5 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 20), duration:5 };
			var p3 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 14), duration:6 };
			processUtility.setEndAt(p1);	//    10 ......15
			processUtility.setEndAt(p2);	//                         20 .......... 25
			processUtility.setEndAt(p3);    //            14 ..........20
						
			var result = [p1, p2];
			assert.deepEqual(result.length, 2);

			processUtility.combineToProcessList(result, p3);
			assert.deepEqual(result.length, 1);
			assert.deepEqual(result[0].start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(result[0].end_at, new Date(2016, 2, 2, 6, 25));
		});


	});


	describe('work on process list', function() {
		it ('compress list', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:5 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 24), duration:2 };
			var p3 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 14), duration:6 };
			var p4 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 22), duration:3 };
			// p1    10 ......15
			// p2                                   24 .......... 26
			// p3           14 ..........20
			// p4                                22.... 25
						
			var result = [p1, p2, p3, p4];
			assert.deepEqual(result.length, 4);

			result = processUtility.getCompressedProcessList(result);
			assert.deepEqual(result.length, 2);
			assert.deepEqual(result[0].start_at, new Date(2016, 2, 2, 6, 10));
			assert.deepEqual(result[0].end_at, new Date(2016, 2, 2, 6, 20));
			assert.deepEqual(result[0].duration, 10);

			assert.deepEqual(result[1].start_at, new Date(2016, 2, 2, 6, 22));
			assert.deepEqual(result[1].end_at, new Date(2016, 2, 2, 6, 26));
			assert.deepEqual(result[1].duration, 4);
		});

		it ('duration of list', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:5 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 24), duration:2 };
			var p3 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 14), duration:6 };
			var p4 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 22), duration:3 };
			// p1    10 ......15
			// p2                                   24 .......... 26
			// p3           14 ..........20
			// p4                                22.... 25
						
			var list = [p1, p2, p3, p4];
			duration = processUtility.getProcessDuration(list);
			assert.deepEqual(duration, 14);
		});

		it ('duration of list grouped by date', function() {
			var p1 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 10), duration:5 };
			var p2 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 24), duration:2 };
			var p3 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 2, 6, 14), duration:6 };
			var p4 = { id:4711, process_name: 'javaw', start_at: new Date(2016, 2, 4, 6, 22), duration:3 };
			// p1    10 ......15
			// p2                                   24 .......... 26
			// p3           14 ..........20
			// p4  next date !                               22.... 25
						
			var list = [p1, p2, p3, p4];
			var result = processUtility.getProcessDurationGroupedByDate(list);
			assert.equal(result.length, 2);
			assert.deepEqual(result[0].date, new Date(2016, 2, 2));
			assert.deepEqual(result[1].date, new Date(2016, 2, 4));

			assert.equal(result[0].duration, 12);
			assert.equal(result[1].duration, 3);
		});


	})


	describe('calcDuration', function() {
		
		it ('collect more complicate', function() {
			var oIn = [
		    {   "duration": 40,
		        "id": 3636,
		        "process_name": "javaw",
		        "start_at": "2016-03-26T10:22:52.000Z",
		        "title": "Minecraft 1.8.7",
		    },
		    {   "duration": 77,
		        "id": 3636,
		        "process_name": "javaw",
		        "start_at": "2016-03-26T11:30:46.000Z",
		        "title": "Minecraft 1.8.7",
		    },
		    {   "duration": 2,
		        "id": 7884,
		        "process_name": "javaw",
		        "start_at": "2016-03-26T15:15:05.000Z",
		        "title": "Minecraft 1.9",
		    },
		    {   "duration": 21,
		        "id": 4496,
		        "process_name": "javaw",
		        "start_at": "2016-03-26T15:19:06.000Z",
		        "title": "Minecraft 1.8.7",
		    },
		    {   "duration": 46,
		        "id": 4496,
		        "process_name": "javaw",
		        "start_at": "2016-03-26T16:19:30.000Z",
		        "title": "Minecraft 1.8.7",
		    },
		    {   "duration": 1,
		        "id": 8036,
		        "process_name": "javaw",
		        "start_at": "2016-03-26T17:06:30.000Z",
		        "title": "Minecraft 1.9",
		    },
		    {   "duration": 37,
		        "id": 8036,
		        "process_name": "javaw",
		        "start_at": "2016-03-26T17:10:44.000Z",
		        "title": "Minecraft 1.9",
		    },
		    {   "duration": 19,
		        "id": 5956,
		        "process_name": "javaw",
		        "start_at": "2016-03-26T17:48:44.000Z",
		        "title": "Minecraft 1.8.7",
		    } 
			];

			oIn.forEach( function(p) {
				p.start_at = processUtility.mongoDateToJsDate(p.start_at);
			});

			var result = processUtility.getProcessDurationGroupedByDate(oIn);


		});


	});



});