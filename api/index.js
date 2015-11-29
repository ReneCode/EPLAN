var server = require('./server.js');
	
var port = 3010;
server().listen(port);
console.log('Listing on Port', port);

