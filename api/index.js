/*
	API node-service
	provides a REST service
*/

var server = require('./server.js');

/*
var http = require('http');
	
http.createServer(app).listen(port);
*/

var port = 64010;
server().listen(port, function() {
	console.log('REST Server is listing on Port', port);
});

