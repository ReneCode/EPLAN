
var assert = require('assert');

var wagner = require('wagner-core');


describe('Config', function() {
	var cfg;

	before(function(done) {
		// initialize the 'Config' service
		require('../config.js')(wagner);
		cfg = wagner.invoke(function(config) {
			return config;
		});
		done();
	});


	it ('#mongodb.portnum', function() {
		assert.equal(cfg.mongodb.portnum, 1234);
	});
		
	it ('#mongodb.username', function() {
		assert.equal(cfg.mongodb.hasOwnProperty('username'), true);
		assert.equal(cfg.mongodb.username, "");
	});

});

