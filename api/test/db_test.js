var assert = require('assert');
var wagner = require('wagner-core');
var mongoose = require('mongoose');

describe('Database', function() {


	before(function() {
		require('../config.js')(wagner);
		require('../schema/models.js')(wagner);
	});

	after(function(done) {
		wagner.invoke(function(db) {
			db.connection.close(function() {
				done();
			});
		});
	});



	describe('should work on parts.', function() {
		var PartModel = undefined;

		beforeEach(function(done) {
			PartModel = wagner.invoke(function(Part) {
				return Part;
			});

			// remove all parts
			PartModel.remove({}, function(err) {
				done(); 
			})
		});

		it('create part', function(done) {
			var tempPart = { partnr: '4711', manufacturer:'siemens', 
						ordernr:"4634", data: {characteristics:'220 V'} };
			var p1 = PartModel.create(tempPart, function(err, newPart) {
					assert.equal(newPart.partnr, '4711');
					assert.equal(newPart.ordernr, '4634');
					assert.equal(newPart.data.characteristics, '220 V');
					assert.notEqual(newPart._id, undefined);
					done();
				});
		});


		it('create and find part', function(done) {
			var tempPart = { partnr: '4712', manufacturer:'4712-siemens'};
			var p1 = new PartModel(tempPart);
			p1.save();
			assert.equal(p1.partnr, '4712');
			assert.notEqual(p1._id, undefined);
			PartModel.find({_id: p1._id}, function(err, foundData) {
				assert.equal(err, undefined);
				assert.equal(foundData.length, 1);
				assert.equal(foundData[0].partnr, '4712');
				assert.notEqual(foundData[0]._id, undefined);
				done();
			});
		});


		it ('count created parts', function(done) {
			var p1 = { partnr: 'abc', manufacturer:'ABB'};
			var p2 = { partnr: 'xyz', manufacturer:'siemens'};
			PartModel.create([p1,p2], function(err, newPart) {
				newPart[0].save();
				PartModel.count({}, function(err, foundCount) {
					assert.equal(foundCount, 2); 
					done();  
				});
			});
		});


		it ('find part', function(done) {
			var p1 = { partnr: 'abc', manufacturer:'abb'};
			var p2 = { partnr: 'xyz', manufacturer:'sie'};
			PartModel.create([p1,p2], function(err, newPart) {
//				console.log(newPart);
				newPart[0].save();
				newPart[1].save();
				PartModel.find({partnr:'xyz'}, function(err, found) {
					assert.equal(found.length, 1);
					assert.equal(found[0].manufacturer, 'sie');
					done();
				});
			});
		});

		it ('create multi-language properties', function(done) {
			var p1 = { partnr: 'mlPart', note: {de_DE:"Hallo", en_US:"hello"}, 
						description: [ 
								{de_DE:"dd1", en_US:"de1"},
								{de_DE:"dd2", en_US:"de2"},
								{de_DE:"dd3", en_US:"de3"} ] };
			newPart = new PartModel(p1);
			newPart.save();
			var id = newPart._id;
			PartModel.find({_id:id}, function(err, foundData) {
				assert.equal(foundData[0].partnr, "mlPart"); 
				assert.equal(foundData[0].note.de_DE, "Hallo"); 
				assert.equal(foundData[0].description[0].de_DE, "dd1"); 
				assert.equal(foundData[0].description[2].en_US, "de3"); 
				done();  
			});
		});

		it ('update mixed part property', function(done) {
			var p1 = { partnr: 'amlPart', 
						note: {de_DE:"Hallo", en_US:"hello"}, 
						data: { propA: 47,
										propB: "ABC" } };
			newPart = new PartModel(p1);
			newPart.save();
			var id = newPart._id;
			newPart.data.propB = "XYZ";
			PartModel.update({_id:id}, newPart, function(err, result) {
				// part is updated
				assert.equal(result.ok, 1);
				// now get the modified part
				PartModel.find({_id:id}, function(err, foundData) {
					// old Data should be also be there
					assert.equal(foundData[0].partnr, "amlPart"); 
					assert.equal(foundData[0].data.propA, 47); 
					assert.equal(foundData[0].data.propB, "XYZ"); 
					done();  

				});
			});
		});


	});
});

