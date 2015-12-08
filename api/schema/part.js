var mongoose = require('mongoose');

module.exports = (function() {
	var partSchema = new mongoose.Schema({
		partnr:  {
			type: String,
			required: true
		},
		producttopgroup: { type: Number },
		productgroup: { type: Number },
		productsubgroup: { type: Number },
		parttype: { type: Number },
		typenr: { type: String },
		created_at: { type: Date },
		updated_at: { type: Date },
		manufacturer: { type: String },
		description: Array,
		note: {},
		data: Array
	});
	return partSchema;
})();



