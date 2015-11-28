var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {

//	console.log("connect DB");
	mongoose.connect('mongodb://localhost:27017/eplan');

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

