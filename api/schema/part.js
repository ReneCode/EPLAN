var mongoose = require('mongoose');

module.exports = (function() {
	var partSchema = new mongoose.Schema({
		partnr:  {
			type: String,
			required: true
		},
		producttopgroup: { type: Number },
		productgroup: { type: Number },
		created_at: { type: Date },
		updated_at: { type: Date },
		manufacturer: { type: String },
		description1: { type: String },
		note: { type: String },
	});
	return partSchema;
})();



