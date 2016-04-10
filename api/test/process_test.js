
var assert = require('assert');

var app = require('../server');
var wagner = require('wagner-core');
var superagent = require('superagent');

var URL_ROOT = 'http://localhost:3010/process/';





describe('REST Server', function() {
	var server;
	var ProcessModel;
	var ActionModel;

	before(function(done) {
		server = app().listen(3010);
		ProcessModel = wagner.invoke(function(Process) {
			return Process;
		});

		ActionModel = wagner.invoke(function(Action) {
			return Action;
		});

		done();
	});

	beforeEach(function(done) {
		ProcessModel.remove({}, function(err) {
			ActionModel.remove({}, function(err) {
				done();
			});
		});

	});
	
	after(function() {
		server.close();
	});

	describe('Action REST server', function() {
		it('can be called', function(done) {
			var url = URL_ROOT + "/action";
			superagent.get(url, function(err, res) {
				assert.ifError(err);
				done();
			});
		});

		it('create action / REST: POST', function(done) {
			var url = URL_ROOT + "/action";
			var name = "abcxyz";
			superagent.post(url)
					.send({start_at: new Date(), user_name:name })
					.end(function(err, res) {
				var id = res.body._id;
				assert.notEqual(id, null); 
				assert.equal(typeof(id), 'string'); 
				assert(id.length > 10);

				// find that created action in the database
				ActionModel.findOne({_id:id}, function(err, result) {
					assert.equal(null, err);
					assert.equal(result.user_name, name); 
					done();
				});
			});
		});

	}); // describe Action REST server

	describe('Duration REST server', function() {
		it('can be called', function(done) {
			var url = URL_ROOT + "/duration";
			superagent.get(url, function(err, res) {
				assert.ifError(err);
				done();
			});
		});

		it('get one duration', function(done) {
			var dt = new Date(2015,2,16,20,44);
			var tmp = {id:4711, title:"Title-A", process_name:"p1", duration:5, start_at: dt, user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				// that document is 1 minute older
				dt = new Date(2015,2,16,20,40);
				tmp = {id:4712, process_name:"p2", start_at: dt, duration:10, user_name:"lea" };
				ProcessModel.create(tmp, function(err, data) {
					var url = URL_ROOT + "/duration";
					superagent.get(url, function(err, result) {
						assert.equal(result.body.length, 2); 
						assert.equal(result.body[0].duration, 5); 
						assert.equal(result.body[0].process_name, "p1"); 
						assert.equal(result.body[1].process_name, "p2"); 
						done();
					});
				});
			});
		});	

		it ('collect the correct things', function(done) {
			done();
		});


	}); // describe

	describe('Process REST server', function() {

		it('can be called', function(done) {
			var url = URL_ROOT;
			superagent.get(url, function(err, res) {
				assert.ifError(err);
				done();
			});
		});

		it('create process / REST: POST', function(done) {
			var url = URL_ROOT;
			var name = "abcxyz";
			superagent.post(url)
					.send({id:4711, date: new Date(), user_name:name })
					.end(function(err, res) {
				assert.equal(res.body.id, 4711); 
				var id = res.body._id;
				assert.notEqual(id, null); 
				assert.equal(typeof(id), 'string'); 
				assert(id.length > 10);

				// find that created part in the database
				ProcessModel.findOne({_id:id}, function(err, result) {
					// changed typenr
					assert.equal(result.user_name, name); 
					done();
				});
			});
		});

		it('can update process / REST: PUT', function(done) {
			var tmp = {id:4711, start_at: new Date(), user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				assert.equal(data.id, 4711);
				assert.equal(data.user_name, "paul");
				var id = data._id;

				var url = URL_ROOT + id;
				superagent.put(url)
						.send({_id:id, user_name:"martha" })
						.end(function(err, result) {
					assert.equal(result.body.ok, 1); 
					done();
				});
			});
		});


		it('get many process data', function(done) {
			var dt = new Date(2015,2,16,20,44);
			var tmp = {id:4711, title:"Title-A", machine_name:"mach-name", start_at: dt, user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				// that document is 1 minute older
				dt = new Date(2015,2,16,20,40);
				tmp = {id:4712, start_at: dt, duration:5522, user_name:"lea" };
				ProcessModel.create(tmp, function(err, data) {
					var url = URL_ROOT;
					superagent.get(url, function(err, result) {
						assert.equal(result.body.length, 2); 
						assert.equal(result.body[0].duration, 5522); 
						assert.equal(result.body[0].user_name, "lea"); 
						assert.equal(result.body[1].user_name, "paul"); 
						done();
					});
				});
			});
		});		


		it('get one process data', function(done) {
			var tmp = {id:4711, start_at: new Date(), user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				assert.equal(data.id, 4711);
				assert.equal(data.user_name, "paul");
				var id = data._id;

				var url = URL_ROOT + id;
				superagent.get(url, function(err, result) {
					assert.equal(result.body.user_name, "paul"); 
					done();
				});
			});
		});		

		it('delete one process process', function(done) {
			var tmp = {id:4711, user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				var id = data._id;
				tmp = {id:4712, duration:5522, user_name:"lea" };
				ProcessModel.create(tmp, function(err, data) {
					var url = URL_ROOT + id;
					superagent.del(url, function(err, result) {
						assert.equal(result.body.ok, 1); 
						// get once more - (without the deleted document)
						var url = URL_ROOT;
						superagent.get(url, function(err, result) {
							assert.equal(result.body.length, 1); 
							assert.equal(result.body[0].duration, 5522); 
							assert.equal(result.body[0].user_name, "lea"); 
							done();
						});
					});
				});
			});
		});		

		it('filter processes with query object', function(done) {
			var tmp = {id:4711, duration:451, user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				tmp = {id:4712, duration:451, user_name:"lea" };
				ProcessModel.create(tmp, function(err, data) {
					/*
					var url = URL_ROOT + "?f=duration:451+user_name:paul";
					superagent.get(url, function(err, result) {
						*/
					var url = URL_ROOT;
					var filter = { user_name:"paul" };
					superagent.get(url)
										.query(filter)
										.end(function(err, result) {
						assert.equal(result.body.length, 1); 
						assert.equal(result.body[0].duration, 451); 
						assert.equal(result.body[0].user_name, "paul"); 
						done();
					});
				});
			});
		});		


		it('filter processes with url', function(done) {
			var tmp = {id:4711, duration:451, user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				tmp = {id:4712, duration:451, user_name:"lea" };
				ProcessModel.create(tmp, function(err, data) {
					/*
					var url = URL_ROOT + "?f=duration:451+user_name:paul";
					superagent.get(url, function(err, result) {
						*/
					var url = URL_ROOT + "?user_name=paul";
					superagent.get(url)
										.end(function(err, result) {
						assert.equal(result.body.length, 1); 
						assert.equal(result.body[0].duration, 451); 
						assert.equal(result.body[0].user_name, "paul"); 
						done();
					});
				});
			});
		});		


		it('filter process on date', function(done) {
			var dt = new Date(2015,2,15,20,44);
			var tmp = {id:4711, start_at: dt, user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				dt = new Date(2015,2,16,20,40);
				tmp = {id:4712, start_at: dt, user_name:"lea" };
				ProcessModel.create(tmp, function(err, data) {
					var url = URL_ROOT;
					var filter = { start_at : new Date(2015,2,15, 23,25,23)};
					superagent.get(url)
						.query(filter)
						.end(function(err, result) {
						assert.equal(result.body.length, 1); 
						assert.equal(result.body[0].user_name, "paul"); 
						done();
					});
				});
			});
		});		

	});

	describe("group", function() {
		it('group by user_name', function(done) {
			var tmp = {id:4711, duration:451, user_name:"paul" };
			ProcessModel.create(tmp, function(err, data) {
				tmp = {id:4712, duration:451, user_name:"lea" };
				ProcessModel.create(tmp, function(err, data) {

					var url = URL_ROOT + "group/user_name";
					superagent.get(url)
										.end(function(err, result) {
						assert.equal(result.body.length, 2); 
						assert.equal(result.body[0]._id, "lea"); 
						assert.equal(result.body[1]._id, "paul"); 
						done();
					});
				});
			});
		});	

	/*
		it('get all part data', function(done) {
			var p1 = { partnr: 'lap-part', manufacturer:'lap'};
			var p2 = { partnr: 'abb-part', manufacturer:'abb'};
			var p3 = { partnr: 'pxc-part', manufacturer:'pxc'};

			PartModel.create([p1,p2,p3], function(err, newParts) {

				var url = URL_ROOT + '/api/v1/part';
				superagent.get(url, function(err, res) {
					assert.equal(res.body.data.length, 3); 
					assert.equal(res.body.data[0].partnr, 'abb-part');
					assert.equal(res.body.data[1].manufacturer, 'lap');
					assert.equal(res.body.data[2].partnr, 'pxc-part');
					done();
				});
				
			});
		});
		
		it('get filted part data / REST: GET', function(done) {
			var p1 = { partnr: 'ab7-part', manufacturer:'m13'};
			var p2 = { partnr: 'ab59-part', manufacturer:'m14'};
			var p3 = { partnr: 'ab57-part', manufacturer:'m24'};

			PartModel.create([p1,p2,p3], function(err, newParts) {
				// query on "b5"
				var url = URL_ROOT + '/api/v1/part?q=b5';
				superagent.get(url, function(err, res) {
					assert.equal(res.body.data.length, 2); 
					assert.equal(res.body.data[0].partnr, 'ab57-part');
					assert.equal(res.body.data[1].manufacturer, 'm14');
					done();
				});
			});
		});
		

		it('get case insensitive filted part data / REST: GET', function(done) {
			var p1 = new PartModel({ partnr: 'ABcd-part', note: { de_DE: 'great Motor'} });
			p1.save();
			// query on "moto"   should find "Motor"
			var search = "mot";
			var url = URL_ROOT + '/api/v1/part?q=' + search;
			superagent.get(url, function(err, res) {
				assert.equal(res.body.data.length, 1); 
				assert.equal(res.body.data[0].partnr, 'ABcd-part');
				done();
			});
		});


		it('get case insensitive filted part data / REST: GET', function(done) {
			var p1 = { partnr: 'mlPart', note: {de_DE:"Hallo", en_US:"hello"}, 
							description: [ 
									{de_DE:"MotorA", en_US:"de1"},
									{de_DE:"dd2", en_US:"de2"},
									{de_DE:"dd3", en_US:"de3"} ] };
			newPart = new PartModel(p1);
			newPart.save();
			// query on "moto"   should find "Motor"
			var search = "mot";
			var url = URL_ROOT + '/api/v1/part?q=' + search;
			superagent.get(url, function(err, res) {
				assert.equal(res.body.data.length, 1); 
				assert.equal(res.body.data[0].partnr, 'mlPart');
				done();
			});
		});

		it('filter by f-parameter', function(done) {
			var p1 = { partnr: 'ab5-part', manufacturer:'m13'};
			var p2 = { partnr: 'ab4-part', manufacturer:'m13'};
			var p3 = { partnr: 'ab3-part', manufacturer:'m14'};
			var p4 = { partnr: 'ab2-part', manufacturer:'m14'};
			var p5 = { partnr: 'ab1-part', manufacturer:'m15'};
			var p6 = { partnr: 'ab6-part', manufacturer:'m15'};
			var p7 = { partnr: 'aa7-part', manufacturer:'m16'};
			var p8 = { partnr: 'aa8-part', manufacturer:'m14'};

			PartModel.create([p1,p2,p3,p4,p5,p6,p7,p8], function(err, newParts) {
				var filter = "manufacturer:m14"
				var url = URL_ROOT + '/api/v1/part?f=' + filter;
				superagent.get(url, function(err, res) {
					assert.equal(res.body.data.length, 3); 
					assert.equal(res.body.data[0].partnr, 'aa8-part');
					assert.equal(res.body.data[1].partnr, 'ab2-part');
					assert.equal(res.body.data[2].partnr, 'ab3-part');
					done();
				});
				
			});
		});

		it('get skped, limit part data', function(done) {
			var p1 = { partnr: 'ab5-part', manufacturer:'m13'};
			var p2 = { partnr: 'ab4-part', manufacturer:'m13'};
			var p3 = { partnr: 'ab3-part', manufacturer:'m13'};
			var p4 = { partnr: 'ab2-part', manufacturer:'m13'};
			var p5 = { partnr: 'ab1-part', manufacturer:'m13'};
			var p6 = { partnr: 'ab6-part', manufacturer:'m13'};
			var p7 = { partnr: 'aa7-part', manufacturer:'m13'};
			var p8 = { partnr: 'aa8-part', manufacturer:'m13'};

			PartModel.create([p1,p2,p3,p4,p5,p6,p7,p8], function(err, newParts) {
				// get 3 parts and skip the first 2 (ab1,ab2) 
				var url = URL_ROOT + '/api/v1/part?q=ab&limit=3&skip=2';
				superagent.get(url, function(err, res) {
					assert.equal(res.body.data.length, 3); 
					assert.equal(res.body.data[0].partnr, 'ab3-part');
					assert.equal(res.body.data[1].partnr, 'ab4-part');
					assert.equal(res.body.data[2].partnr, 'ab5-part');
					done();
				});
				
			});
		});
	*/




	/*		// change typenr
			var update = { typenr: "newTypenr", partnr:"newPartNr" };
			var url = URL_ROOT + '/api/v1/part/' + id;
			// REST: update = put-verb
			superagent.put(url)
						.send(update)
						.end(function(err, res) {
				// check if the new part was updated
				assert.equal(res.body.data.ok, 1); 
				assert.equal(res.body.data.n, 1); 

				PartModel.findOne({_id:id}, function(err, result) {
					// changed typenr
					assert.equal(result.typenr, "newTypenr"); 
					assert.equal(result.partnr, "newPartNr"); 
					assert.equal(result.note.de_DE, "notiz"); 
					done();

				});
			});
		});
	*/
	/*
		it('can delete a part / REST: DEL', function(done) {
			// create new part
			var tmpPart = {partnr:'deletePart', typenr:"typenr", note: { de_DE:"notiz"} };
			p1 = new PartModel(tmpPart);
			p1.save(); 
			var id = p1._id;

			// delete that part
			var url = URL_ROOT + '/api/v1/part/' + id;
			// REST: delete = delete-verb
			superagent.del(url)
						.end(function(err, res) {
				// check if the new part was deleted
				assert.equal(res.body.data.ok, 1); 
				assert.equal(res.body.data.n, 1); 

				PartModel.findOne({_id:id}, function(err, result) {
					assert.equal(err, null);
					// no part should be found
					assert.equal(result, null);
					done();
				});
			});
		});
	*/
	});
});


