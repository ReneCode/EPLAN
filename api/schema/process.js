var mongoose = require('mongoose');

module.exports = (function() {
	var processSchema = new mongoose.Schema({
		id: { type: Number, required: true },
		title: { type: String },
		machine_name: { type: String },
		process_name: { type: String },
		user_name: { type: String },
		start_date: { type: Date },
		duration: { type: Number }
	});
	return processSchema;
})();



