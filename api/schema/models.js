var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {

//	console.log("connect DB");


	var connectUrl = 'mongodb://localhost:27017/eplan';

	var mongoConfig = require('./mongo_config.json');
	if (mongoConfig.username) {
		connectUrl = 'mongodb://' + 
					mongoConfig.username + ":" + 
					mongoConfig.password + "@" +
					mongoConfig.hostname + ":" + 
					mongoConfig.portnum + "/eplan";
	}

	console.log("mongoConnect:", connectUrl);

	mongoose.connect(connectUrl);

	wagner.factory('db', function() {
		return mongoose;
	});

	var Part = mongoose.model('Part', require('./part.js'), 'parts');

	var models = {
		Part: Part
	};

	// register models
	_.each(models, function(value, key) {
		wagner.factory(key, function() {
			return value;
		});
	});
}

