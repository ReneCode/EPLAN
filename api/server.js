
module.exports = function() {

	var express = require('express');
	var wagner = require('wagner-core');
	var cors = require('cors');

	require('./schema/models.js')(wagner);

	var app = express();

	app.use(cors());

	app.use('/api/v1', require('./api')(wagner));

	return app;

}

