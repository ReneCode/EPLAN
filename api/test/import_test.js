
var assert = require('assert');
var importUtility = require('../importUtility');

describe('Import Utility', function() {

	it('should extract multilanguages', function() {
		var sIn = "de_DE@Hydraulikschlauch;en_US@Hydraulic tube;es_ES@Manguera hidráulica;fr_FR@Tuyau hydraulique;nl_NL@Hydraulica slang;sv_SE@Hydraulikslang;da_DK@Hydraulikslange;ru_RU@Гидравлический шланг;zh_CN@液压软管;pl_PL@Wąż hydrauliczny;pt_BR@Tubo hidráulico;cs_CZ@Hydraulická hadice;it_IT@Tubo idraulico flessibile;hu_HU@Hidraulikus tömlő;pt_PT@Mangueira hidráulica;ko_KR@유압 튜브;ja_JP@油圧管;"

		var oOut = importUtility.convertToObject(sIn);
		assert.equal(oOut.de_DE, "Hydraulikschlauch");
		assert.equal(oOut.es_ES, "Manguera hidráulica");

	});

});