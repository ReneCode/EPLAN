var server = require('./server.js');
var fs = require('fs');

var app = server();
var http = require('http');
var https = require('https');
	
var port = 64010;
http.createServer(app).listen(port);
/*
var options = {
   key  : fs.readFileSync('server.key'),
   cert : fs.readFileSync('server.crt')
};
*/
/*
https.createServer(options, app).listen(443,function(err) {
	console.log("error:", err);
});
*/

console.log('REST Server is listing on Port', port);

