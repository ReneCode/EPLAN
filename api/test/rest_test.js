var app = require('../server');
var assert = require('assert');
var wagner = require('wagner-core');
var superagent = require('superagent');

var URL_ROOT = 'http://localhost:3000';

describe('REST Server', function() {
	var server;

	before(function(done) {
		var mongoDb = wagner.invoke(function(db) {
			return db;
		});
		mongoDb.connection.close(function() {
			server = app().listen(3000);

			done();
		});
	});

	
	after(function() {
		server.close();
	});

	it('can be called', function(done) {
		var url = URL_ROOT + '/api/v1/parts';
		superagent.get(url, function(err, res) {
//			assert.ifError(err);
		done();
		});
	});

	it('get part data', function(done) {
		var url = URL_ROOT + '/api/v1/parts/453';
		superagent.get(url, function(err, res) {
//			assert.ifError(err);
		done();
		});
	});


});


