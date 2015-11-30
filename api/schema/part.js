var mongoose = require('mongoose');

module.exports = (function() {
	var partSchema = new mongoose.Schema({
		partnr:  {
			type: String,
			required: true
		},
		created_at: { type: Date },
		updated_at: { type: Date },
		manufacturer: { type: String },
		description1: { type: String }
	});
	return partSchema;
})();



