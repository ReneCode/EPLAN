
var bodyparser = require('body-parser');
var express = require('express');


/*
	REST interface

	routing of: "/logging"

	POST  	create a new logging
	GET     get all/some logging (with filter)
*/

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());

 	// create a loging
 	api.post('/', wagner.invoke(function(Logging) {
		return function(req, res) {
			var p = req.body;
			if (Object.keys(p).length == 0) {
				// no post data
				// than check out the parameter
				p = req.query;
			}
			// remove _id - it will get a new _id from mongo
			delete p._id;
			var logging = Logging.create(p, function(err, data) {
				if (err) {
					res.send(err);
				} else {
					res.send(data);
				}
			});
		};
	}));




 	// query process - get multiple parts
 	api.get('/', wagner.invoke(function(Logging) {
 		return function(req, res) {
 			skip = req.query.skip || 0;
 			limit = req.query.limit || 200;

 			// f  = filter
 			var filter = { };

 			if (req.query.source) {
				filter.source = req.query.source;
 			}
 			if (req.query.date) {
 				filter.date = req.query.date;
 			}

	 		if (filter.date) {
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

	 			filter.start_at = {"$gte": minDt, "$lt": maxDt};
	 		}

 			Logging.find(filter).sort('date').skip(skip).limit(limit).exec(function(err, data) {
 				res.json(data);
 			});
 		};
 	}));



	return api;
};

