var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
	var connectUrl = 'mongodb://localhost:27017/eplan';

	var cfg = wagner.invoke(function(config) {
		return config;
	});

	if (cfg.mongodb.username) {
		connectUrl = 'mongodb://' + 
					cfg.mongodb.username + ":" + 
					cfg.mongodb.password + "@" +
					cfg.mongodb.hostname + ":" + 
					cfg.mongodb.portnum + "/eplan";
	}

	mongoose.connect(connectUrl);

	wagner.factory('db', function() {
		return mongoose;
	});

	var Part = mongoose.model('Part', require('./part.js'), 'parts');
	var Process = mongoose.model('Process', require('./process.js'), 'process');

	var models = {
		Part: Part,
		Process: Process
	};

	// register models
	_.each(models, function(value, key) {
		wagner.factory(key, function() {
			return value;
		});
	});
}

