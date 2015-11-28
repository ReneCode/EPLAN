var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	partnr:  {
		type: String,
		required: true
	},
	manufacturer: { type: String },
	description1: { type: String }
});

