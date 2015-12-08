
var assert = require('assert');

var app = require('../server');
var wagner = require('wagner-core');
var superagent = require('superagent');

var URL_ROOT = 'http://localhost:3010';


describe('REST Server', function() {
	var server;
	var PartModel;

	before(function(done) {
		server = app().listen(3010);
		PartModel = wagner.invoke(function(Part) {
			return Part;
		});
		done();
	});

	beforeEach(function(done) {
		PartModel.remove({}, function(err) {
			done();
		});
	});
	
	after(function() {
		server.close();
	});

	it('can be called', function(done) {
		var url = URL_ROOT + '/api/v1/part';
		superagent.get(url, function(err, res) {
			assert.ifError(err);
			done();
		});
	});



	it('create part / REST: POST', function(done) {
		var url = URL_ROOT + '/api/v1/part';
		var name = "abcxyz";
		superagent.post(url)
				.send({"partnr":name})
				.end(function(err, res) {
			assert.equal(res.body.data.partnr, name); 
			var id = res.body.data._id;
			assert.notEqual(id, null); 
			assert.equal(typeof(id), 'string'); 
			assert(id.length > 10);

			// find that created part in the database
			PartModel.findOne({_id:id}, function(err, result) {
				// changed typenr
				assert.equal(result.partnr, name); 
				done();
			});
		});
	});


	it('get one part data', function(done) {
		// create part
		var name = "veryNewPart";
		var part = new PartModel({partnr:name, manufacturer:"sie"});
		part.save();
		// id of that part
		var createdId = part._id;

		url = URL_ROOT + '/api/v1/part/' + createdId;
		superagent.get(url, function(err, res) {
			var part = res.body.data;
			assert.equal(part.partnr, name);
			assert.equal(part._id, createdId);
			assert.equal(part.manufacturer, "sie");
			done();
		});
	});		

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

	it('can update part data / REST: PUT', function(done) {
		var tmpPart = {partnr:'update', typenr:"typenr", note: { de_DE:"notiz"} };
		p1 = new PartModel(tmpPart);
		p1.save(); 
		var id = p1._id;

		// change typenr
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

});


