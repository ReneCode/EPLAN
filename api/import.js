var wagner = require('wagner-core');
var _ = require('underscore');


require('./config')(wagner);
require('./schema/models.js')(wagner);

PartsModel = wagner.invoke(function(Part) {
	return Part;
})

var fileData = require('../try/parts.json');

// import all parts as one array
PartsModel.create(fileData.parts, function(err, data) {
	if (err) {
		console.log("Error:", err);
	}
	console.log(data);

	closeConnection();

});



function closeConnection() {
	wagner.invoke(function(db) {
		db.connection.close(function() {
			console.log("fnished");
		});
	});

}


