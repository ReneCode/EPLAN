
var bodyparser = require('body-parser');
var express = require('express');


/*
	REST interface

	routing of: "/process/action"

	POST  	create a new process
	GET     get all/some process (with filter)
	PUT     update a process
*/

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());


	// get single action
	api.get('/:id', wagner.invoke( function(Action) {
		return function(req, res) {
			Action.findOne({_id:req.params.id}, function(err, data) {
				res.json(data);
			});
		};
	}));
 
 	// create a action
 	api.post('/', wagner.invoke(function(Action) {
		return function(req, res) {
			var p = req.body;
			// remove _id - it will get a new _id from mongo
			delete p._id;
			var process = Action.create(p, function(err, data) {
				if (err) {
					res.send(err);
				} else {
					res.send(data);
				}
			});
		};
	}));

 	// query action - get multiple parts
 	api.get('/', wagner.invoke(function(Action) {
 		return function(req, res) {
 			skip = req.query.skip || 0;
 			limit = req.query.limit || 100;

 			// f  = filter
 			var filter = { };

 			if (req.query.user_name) {
				filter.user_name = req.query.user_name;
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

	 			filter.start_at = {"$gte": minDt, "$lt": maxDt};
	 		}

 			Action.find(filter).sort('start_at').skip(skip).limit(limit).exec(function(err, data) {
 				res.json(data);
 			});
 		};
 	}));

 	// update one process
 	api.put('/:id', wagner.invoke(function(Action) {
 		return function(req, res) {
 			var updateProcess = req.body;
 			Action.update({_id:req.params.id}, updateProcess, function(err, result) {
 				if (err) {
 					res.send(err);
 				} else {
 					res.send(result);
 				}
 			});
 		};
 	}));

 	api.delete('/:id', wagner.invoke(function(Action) {
 		return function(req, res) {
 			Action.remove({_id:req.params.id}, function(err, result) {
 				if (err) {
 					res.send(err);
 				} else {
 					res.send(result);
 				}
 			});
 		};
 	}));

	return api;
};

