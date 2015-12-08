
var bodyparser = require('body-parser');
var express = require('express');

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());

	api.get('/part/:id', wagner.invoke( function(Part) {
		return function(req, res) {
			Part.findOne({_id:req.params.id}, function(err, data) {
				console.dir(data);
				res.json({data:data});
			});
		};
	}));
 
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

 	api.get('/part', wagner.invoke(function(Part) {
 		return function(req, res) {
 			skip = req.query.skip || 0;
 			limit = req.query.limit || 100;

 			q = req.query.q; 
 			var filter = {};
 			if (q) {
 				var partfilter = {partnr: { $regex: '.*' + q + '.*'} };
 				var descfilter = {description1: { $regex: '.*' + q + '.*'} };
 				filter = { $or: [partfilter, descfilter] } 
 			}
// 			console.log("skip:", skip, " limit:", limit, " query:", JSON.stringify(filter) );
 			Part.find(filter).sort('partnr').skip(skip).limit(limit).exec(function(err, data) {
// 				console.log(data);
 				res.json({data:data});
 			});
 		};
 	}));

	return api;
};

