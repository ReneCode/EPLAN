
var _ = require('underscore');

module.exports = (function() {

	function convertToObject(sIn) {

		// de_DE@Hydraulikschlauch;en_US@Hydraulic tube;

		aText = sIn.split(';');
		var oOut = {};
		aText.forEach(function(t) {
			aStr = t.split('@');
			if (aStr.length == 2) {
				oOut[ aStr[0] ] = aStr[1];
			}
		});

		return oOut;
	}

	return {
		convertToObject: convertToObject
	}
})();

