var mongoose = require('mongoose');

module.exports = (function() {
	var loggingSchema = new mongoose.Schema({
		source: { type: String },
		text: { type: String, required: true },
		date: { type: Date, default: Date.now },
	});
	return loggingSchema;
})();



