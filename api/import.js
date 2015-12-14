var wagner = require('wagner-core');
var _ = require('underscore');
var async = require('async');
var importUtility = require('./importUtility');


require('./config')(wagner);
require('./schema/models.js')(wagner);

PartsModel = wagner.invoke(function(Part) {
	return Part;
});

ProductgroupModel = wagner.invoke(function(Productgroup) {
	return Productgroup;
});


var fileData = require('../try/pm-data.json');
collectParts(fileData);


function pushValue(arr, val) {
	if (val) {
		arr.push(val);
	}
}

function mlValue(str) {
	if (str) {
		return importUtility.convertEplanMultiLanguageStringToObject(str);
	} else {
		return null;
	}

}

function importPart(ip, callback) {
	var np = {
		partnr: ip._P_ARTICLE_PARTNR,
		typenr: ip._P_ARTICLE_TYPENR,
		type: ip._P_ARTICLE_PARTTYPE,
		producttopgroup: ip._P_ARTICLE_PRODUCTTOPGROUP,
		productgroup: ip._P_ARTICLE_PRODUCTGROUP,
		productsubgroup: ip._P_ARTICLE_PRODUCTSUBGROUP,
		ordernr: ip._P_ARTICLE_ORDERNR,
		description: [],
		note: mlValue(ip._P_ARTICLE_NOTE),
		manufacturer: ip._P_ARTICLE_MANUFACTURER,
		supplier: ip._P_ARTICLE_SUPPLIER,
		data: {
			height: ip._P_ARTICLE_HEIGHT,
			width: ip._P_ARTICLE_WIDTH,
			depth: ip._P_ARTICLE_DEPTH,
			quantityunit: mlValue(ip._P_ARTICLE_QUANTITYUNIT),
			connectioncrosssection: mlValue(ip.variant._P_ARTICLE_CONNECTIONCROSSSECTION),
			characteristics: ip.variant._P_ARTICLE_CHARACTERISTICS,
			attribute: []
		}
	};

	pushValue(np.description, mlValue(ip._P_ARTICLE_DESCR1));
	pushValue(np.description, mlValue(ip._P_ARTICLE_DESCR2));
	pushValue(np.description, mlValue(ip._P_ARTICLE_DESCR3));

	_.each(ip.attributeposition, function(apos) {
		if (apos._P_ARTICLE_ATTRIBUTE_VALUE) {
			np.data.attribute.push(apos._P_ARTICLE_ATTRIBUTE_VALUE)
		}
	});

	console.log(np.partnr);
	var newPart = new PartsModel(np);
	newPart.save();
	callback();

}

function collectParts(inData) {
	async.each(inData.partsmanagement.part, importPart, function(err) {
		console.log("finished collectParts");
		closeConnection();
	});
}


function saveParts(parts) {
	// import all parts as one array
	PartsModel.create(parts, function(err, data) {
		if (err) {
			console.log("Error:", err);
		}
//		console.log(data);
	});
}



function closeConnection() {
	wagner.invoke(function(db) {
		db.connection.close(function() {
//			console.log("fnished");
		});
	});

}


