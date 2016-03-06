
var bodyparser = require('body-parser');
var express = require('express');


/*
	REST interface

	POST  	create a new process
	GET     get all/some process (with filter)
	PUT     update a process
*/

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());

	// get single process
	api.get('/:id', wagner.invoke( function(Process) {
		return function(req, res) {
			Process.findOne({_id:req.params.id}, function(err, data) {
				res.json(data);
			});
		};
	}));
 
 	// create a process
 	api.post('/', wagner.invoke(function(Process) {
		return function(req, res) {
			var p = req.body;
			// remove _id - it will get a new _id from mongo
			delete p._id;
			var process = Process.create(p, function(err, data) {
				if (err) {
					res.send(err);
				} else {
					res.send(data);
				}
			});
		};
	}));

 	// query process - get multiple parts
 	api.get('/', wagner.invoke(function(Process) {
 		return function(req, res) {
 			skip = req.query.skip || 0;
 			limit = req.query.limit || 100;

 			// f  = filter
 			var filter = {};
 			if (typeof(req.query.f) == 'object') {
 				filter = req.query.f;
 			} 
 			else if (typeof(req.query.f) == 'string') {
	 			if (typeof(req.query.f) == 'string') {
	 				filter = {};
	 				var aFilter = req.query.f.split(' ');
	 				aFilter.forEach( function(f) {
		 				var aTok = f.split(':');
		 				if (aTok.length == 2) {
		 					filter[aTok[0]] = aTok[1];
		 				}
	 				});
	 			}
	 		}

 			Process.find(filter).sort('start_at').skip(skip).limit(limit).exec(function(err, data) {
 				res.json(data);
 			});
 		};
 	}));

 	// update one process
 	api.put('/:id', wagner.invoke(function(Process) {
 		return function(req, res) {
 			var updateProcess = req.body;
 			Process.update({_id:req.params.id}, updateProcess, function(err, result) {
 				if (err) {
 					res.send(err);
 				} else {
 					res.send(result);
 				}
 			});
 		};
 	}));

 	api.delete('/:id', wagner.invoke(function(Process) {
 		return function(req, res) {
 			Process.remove({_id:req.params.id}, function(err, result) {
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

