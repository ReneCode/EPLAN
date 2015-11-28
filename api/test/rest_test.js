var app = require('../server');
var assert = require('assert');
var wagner = require('wagner-core');
var superagent = require('superagent');

var URL_ROOT = 'http://localhost:3000';


describe('REST Server', function() {
	var server;

	before(function(done) {
		server = app().listen(3000);
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


	it('get part data', function(done) {
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

	

});


