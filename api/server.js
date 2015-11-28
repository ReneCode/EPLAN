
module.exports = function() {

	var express = require('express');
	var wagner = require('wagner-core');

	require('./schema/models.js')(wagner);

	var app = express();

	app.use('/api/v1', require('./api')(wagner));

	return app;

}

