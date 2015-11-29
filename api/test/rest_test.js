var app = require('../server');
var assert = require('assert');
var wagner = require('wagner-core');
var superagent = require('superagent');

var URL_ROOT = 'http://localhost:3010';


describe('REST Server', function() {
	var server;

	before(function(done) {
		server = app().listen(3010);
		done();
	});

	
	after(function() {
		server.close();
	});

	it('can be called', function(done) {
		var url = URL_ROOT + '/api/v1/part';
		superagent.get(url, function(err, res) {
//			assert.ifError(err);
			done();
		});
	});



	it('create part', function(done) {
		var url = URL_ROOT + '/api/v1/part';
		var name = "abcxyz";
		superagent.post(url)
							.send({"partnr":name})
							.end(function(err, res) {
			assert.equal(res.body.data.partnr, name); 
			done();
		});
	});


	it('get one part data', function(done) {
		// create part
		var url = URL_ROOT + '/api/v1/part';
		var name = "test1234";
		superagent.post(url)
							.send({partnr:name, manufacturer:"sie"})
							.end(function(err, res) {
			// get that part
			var createdId = res.body.data._id;

			url = URL_ROOT + '/api/v1/part/' + createdId;
			superagent.get(url, function(err, res) {
				var part = res.body.data;
//				console.log(part);
				assert.equal(part.partnr, name);
				assert.equal(part._id, createdId);
				assert.equal(part.manufacturer, "sie");
				done();
			});
		});
	});		

	it('get all part data', function(done) {

		PartModel = wagner.invoke(function(Part) {
			return Part;
		});
		PartModel.remove({}, function(err) {

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
	});
	

});


