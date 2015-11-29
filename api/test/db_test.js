var assert = require('assert');
var wagner = require('wagner-core');
var mongoose = require('mongoose');

describe('Database', function() {


	before(function() {
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
			var tempPart = { partnr: '4711', manufacturer:'siemens'};
			var p1 = PartModel.create(tempPart, function(err, newPart) {
					assert.equal(newPart.partnr, '4711');
					assert.notEqual(newPart._id, undefined);
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

	});
});

