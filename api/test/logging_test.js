
var assert = require('assert');

var app = require('../server');
var wagner = require('wagner-core');
var superagent = require('superagent');

var URL_ROOT = 'http://localhost:3010/logging/';


describe('REST Server Logging', function() {
	var server;
	var LoggingModel;

	before(function(done) {
		server = app().listen(3010);

		LoggingModel = wagner.invoke(function(Logging) {
			return Logging;
		});

		done();
	});

	beforeEach(function(done) {
		LoggingModel.remove({}, function(err) {
			done();
		});

	});
	
	after(function(done) {
		server.close(function() {
			done();
		});
	});

	describe('Action REST server', function() {
		it('can be called', function(done) {
			var url = URL_ROOT + "/action";
			superagent.get(url, function(err, res) {
				assert.ifError(err);
				done();
			});
		});

		it('create logging with send-data/ REST: POST', function(done) {
			var url = URL_ROOT;
			var text = "abcxyz";
			superagent.post(url)
					.send({text: text})
					.end(function(err, res) {
				var id = res.body._id;
				assert.notEqual(id, null); 
				assert.equal(typeof(id), 'string'); 
				assert(id.length > 10);

				// find that created action in the database
				LoggingModel.findOne({_id:id}, function(err, result) {
					assert.equal(null, err);
					assert.equal(result.text, text); 
					done();
				});
			});
		});


		function objToParameter(obj) {
			var str = "";
			for (var key in obj) {
			    if (str != "") {
			        str += "&";
			    }
			    str += key + "=" + encodeURIComponent(obj[key]);
			}
			return str;
		}


		it('create logging with parameter-data / REST: POST', function(done) {
			var url = URL_ROOT;
			var text = "my-parameter";
			var data = {text: text};
			superagent.post(url + "?"+ objToParameter(data), function(err, res) {
				var id = res.body._id;
				assert.notEqual(id, null); 
				assert.equal(typeof(id), 'string'); 
				assert(id.length > 10);

				// find that created action in the database
				LoggingModel.findOne({_id:id}, function(err, result) {
					assert.equal(null, err);
					assert.equal(result.text, text); 
					done();
				});
			});
		});


		it('get many logging data', function(done) {
			var dt = new Date(2015,2,16,20,44);
			var tmp = { text: "abc"  };
			LoggingModel.create(tmp, function(err, data) {
				tmp = { text: "ert" };
				LoggingModel.create(tmp, function(err, data) {
					var url = URL_ROOT;
					superagent.get(url, function(err, result) {
						assert.equal(result.body.length, 2); 
						assert.equal(result.body[0].text, "abc"); 
						assert.equal(result.body[1].text, "ert"); 
						done();
					});
				});
			});
		});		

	
	});
});


