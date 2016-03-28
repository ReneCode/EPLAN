var mongoose = require('mongoose');

module.exports = (function() {
	var ActionSchema = new mongoose.Schema({
		action: { type: String },
		parameter: { type: String },
		return: { type: String },
		user_name: { type: String },
		start_at: { type: Date },
	});
	return ActionSchema;
})();



