var server = require('./server.js');
	
var port = 64010;
server().listen(port);
console.log('REST Server is listing on Port', port);

