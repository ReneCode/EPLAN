
var bodyparser = require('body-parser');
var express = require('express');
var processUtility = require('./processUtility');

/*
	REST interface


	GET     get all/some process (with filter)

*/

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());

 	// query process - get multiple durations
 	api.get('/', wagner.invoke(function(Process) {
 		return function(req, res) {
 			skip = req.query.skip || 0;
 			limit = req.query.limit || 100;

 			// f  = filter
 			var filter = { };

 			if (req.query.user_name) {
				filter.user_name = req.query.user_name;
 			}
 			if (req.query.process_name) {
 				filter.process_name = req.query.process_name;
 			}
 			if (req.query.start_at) {
 				filter.start_at = req.query.start_at;
 			}

	 		if (filter.start_at) {
	 			// filter on start date 
	 			// -> filter on just that date - without time
	 			// >= filterDate  &&  < filterDate+1
	 			var dt = new Date(filter.start_at);
	 			var minDt = new Date(dt);
	 			minDt.setHours(0);
	 			minDt.setMinutes(0);
	 			minDt.setSeconds(0);
	 			var maxDt = new Date(minDt);
	 			maxDt.setDate(minDt.getDate()+1);

	 			filter.start_at = {"$gte": minDt, "$lte": maxDt};
	 		}

 			Process.find(filter).sort('start_at').skip(skip).limit(limit).exec(function(err, data) {
 				res.json( {duration:processUtility.getProcessListDuration(data)} );
 			});
 		};
 	}));

 	

	return api;
};

