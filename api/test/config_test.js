
var asssert = require('assert');

var app = require('../server');
var assert = require('assert');
var wagner = require('wagner-core');


describe('Config', function() {
	var cfg;

	before(function(done) {
		app()
		cfg = wagner.invoke(function(config) {
			return config;
		});
		done();
	});

	after(function(done) {
		wagner.invoke(function(db) {
			db.connection.close(function() {
				done();
			});
		});
	});


	it ('#mongodb.portnum', function() {
		assert.equal(cfg.mongodb.portnum, 1234);
	});
		
	it ('#mongodb.username', function() {
		assert.equal(cfg.mongodb.hasOwnProperty('username'), true);
		assert.equal(cfg.mongodb.username, "");
	});

});

