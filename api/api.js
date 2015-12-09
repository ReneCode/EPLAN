
var bodyparser = require('body-parser');
var express = require('express');


/*
	REST interface

	POST  	create a new part
	GET     get all/some parts (with filter)
	PUT     update a part
	DEL     delete (remove) a part
*/

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());

	// get single part
	api.get('/part/:id', wagner.invoke( function(Part) {
		return function(req, res) {
			Part.findOne({_id:req.params.id}, function(err, data) {
//				console.dir(data);
				res.json({data:data});
			});
		};
	}));
 
 	// create a part
 	api.post('/part', wagner.invoke(function(Part) {
		return function(req, res) {
//			console.log("post:", req.body);
//			var p = {partnr:req.body.partnr}
			var p = req.body;
			var part = Part.create(p, function(err, data) {
				if (err) {
					res.send(err);
				} else {
					res.send({data:data});
				}
			});

		};
	}));

 	// query parts - get multiple parts
 	api.get('/part', wagner.invoke(function(Part) {
 		return function(req, res) {
 			skip = req.query.skip || 0;
 			limit = req.query.limit || 100;

 			q = req.query.q; 
 			var filter = {};
 			if (q) {
 				// create /searchtext/i
 				// regular expression, case insensitive search
 				var regex = new RegExp([q].join(""),"i");
 				var partfilter = {partnr: regex }; 
 				var descfilter = { 'description.0.de_DE': regex };
 				var notefilter = { 'note.de_DE': regex };
 				filter = { $or: [partfilter, descfilter, notefilter] };
 			}
 			Part.find(filter).sort('partnr').skip(skip).limit(limit).exec(function(err, data) {
 				res.json({data:data});
 			});
 		};
 	}));

 	// update one part
 	api.put('/part/:id', wagner.invoke(function(Part) {
 		return function(req, res) {
 			var updatePart = req.body;
 			Part.update({_id:req.params.id}, updatePart, function(err, result) {
 				if (err) {
 					res.send(err);
 				} else {
 					res.send({data: result});
 				}
 			});
 		};
 	}));

 	api.delete('/part/:id', wagner.invoke(function(Part) {
 		return function(req, res) {
 			Part.remove({_id:req.params.id}, function(err, result) {
 				if (err) {
 					res.send(err);
 				} else {
 					res.send({data: result});
 				}
 			});
 		}
 	}));

	return api;
};

