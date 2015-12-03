var wagner = require('wagner-core');
var _ = require('underscore');


require('./config')(wagner);
require('./schema/models.js')(wagner);

PartsModel = wagner.invoke(function(Part) {
	return Part;
})

var fileData = require('../try/parts.json');

/*
var p1 = {partnr:"xya"};
var p2 = {partnr:"xsdf"};
PartsModel.create([p1,p2], function(err, data) {
	if (err) {
		console.log("Error:", err);
	}
	console.log(data);

	closeConnection();

});
*/


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


