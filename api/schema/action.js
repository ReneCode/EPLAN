var mongoose = require('mongoose');

module.exports = (function() {
	var ActionSchema = new mongoose.Schema({
		action: 		{ type: String },
		parameter: 	{ type: String },
		result: 		{ type: String },
		user_name: 	{ type: String },
		start_at: 	{ type: Date }
	});
	return ActionSchema;
})();



