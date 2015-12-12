
module.exports = function() {

	var express = require('express');
	var wagner = require('wagner-core');
	var cors = require('cors');

	// initialize the 'Config' service
	require('./config.js')(wagner);

	require('./schema/models.js')(wagner);

	var app = express();

	app.use(cors());

	app.use('/api/v1', require('./api')(wagner));

	app.use('/', function(req, res, next) {
 		res.send("this is the API layer");
	});

	return app;

}

