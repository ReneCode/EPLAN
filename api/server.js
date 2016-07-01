
module.exports = function() {

	var express = require('express');
	var wagner = require('wagner-core');
	var cors = require('cors');
	var http = require('http');
	var mongoose = require('mongoose');

	// initialize the 'Config' service
	require('./config.js')(wagner);

	require('./schema/models.js')(wagner);

	var app = express();

/*
	app.use( function(req, res, next) {
	//	console.log(new Date(), req.method, req.url);
  	next();
	});
*/

	app.use(cors());

	app.use('/api/v1', require('./api')(wagner));
	app.use('/process', require('./process_api')(wagner));

	app.use('/', function(req, res, next) {
 		res.send("Welcome. This is the API layer.");
	});


	var server = http.createServer(app);

	server.on('close', function() {
		// close connection + reset the models
		// than restarting (during tests) is possible
		mongoose.models = [];
		mongoose.connection.close();
	});

	return server;
};

