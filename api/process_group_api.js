
var bodyparser = require('body-parser');
var express = require('express');
var processUtility = require('./processUtility');

/*


*/

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());

 	api.get('/user_name', wagner.invoke(function(Process) {
 		return function(req, res) {
 			Process.aggregate([{$group: {"_id": "$user_name"}}]).exec(function(err, data) {
 				res.json( data );
 			});
 		};
 	}));

	return api;
};

