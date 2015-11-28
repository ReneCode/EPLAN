var server = require('./server.js');
	
var port = 3000;
server().listen(port);
console.log('Listing on Port', port);

