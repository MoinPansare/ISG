var DatabaseInteraction = {};

(function() {

	DatabaseInteraction.AddIncident = function(blob) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS incident (time TEXT,location TEXT,img1 BLOB,img2 BLOB, img3 BLOB , img4 BLOB ,imgSelectorTag TEXT,userLat TEXT,userLong TEXT)');
		db.execute('DELETE FROM incident WHERE time="' + escape(blob.time) + '"');
		db.execute('INSERT INTO incident (time,location,img1,img2,img3,img4,imgSelectorTag,userLat,userLong) VALUES(?,?,?,?,?,?,?,?,?)', escape(blob.time), escape(blob.location), blob.img1, blob.img2, blob.img3, blob.img4 , blob.imgSelectorTag ,blob.lat,blob.lon);
		db.close();
	};
	
	DatabaseInteraction.getIncidents = function() {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS incident (time TEXT,location TEXT,img1 BLOB,img2 BLOB, img3 BLOB , img4 BLOB ,imgSelectorTag TEXT,userLat TEXT,userLong TEXT)');
		
		var holddatavar = db.execute('SELECT * FROM incident');
		var arrayToReturn = [];

		while (holddatavar.isValidRow()) 
		{
			var blob = {
				time : unescape( holddatavar.fieldByName('time') ),
				location : unescape( holddatavar.fieldByName('location') ),
				img1 : holddatavar.fieldByName('img1'),
				img2 : holddatavar.fieldByName('img2'),
				img3 : holddatavar.fieldByName('img3'),
				img4 : holddatavar.fieldByName('img4'),
				selectionTag : holddatavar.fieldByName('imgSelectorTag'),
				lat : holddatavar.fieldByName('userLat'),
				lon : holddatavar.fieldByName('userLong')
			};
			arrayToReturn.push(blob);
			holddatavar.next();
		}
		holddatavar.close();
		db.close();
		return arrayToReturn;
	};
	
	DatabaseInteraction.deleteIncident = function(time) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS incident (time TEXT,location TEXT,img1 BLOB,img2 BLOB, img3 BLOB , img4 BLOB ,imgSelectorTag TEXT,userLat TEXT,userLong TEXT)');
		db.execute('DELETE FROM incident WHERE time="'+escape(time)+'"');
		db.close();
	};
	
	
	DatabaseInteraction.updateIncident = function(location,lat,lon,time) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS incident (time TEXT,location TEXT,img1 BLOB,img2 BLOB, img3 BLOB , img4 BLOB ,imgSelectorTag TEXT,userLat TEXT,userLong TEXT)');
		db.execute('UPDATE incident SET location="'+location+'" WHERE time="'+escape(time)+'"');
		db.execute('UPDATE incident SET userLat="'+lat+'" WHERE time="'+escape(time)+'"');
		db.execute('UPDATE incident SET userLong="'+lon+'" WHERE time="'+escape(time)+'"');		
		db.close();
	};
	
	DatabaseInteraction.addOtherDriver = function(blob, time) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS otherDriver (time TEXT,id TEXT,name TEXT,phone TEXT,emailId TEXT,carRegistration TEXT,description TEXT,injury TEXT)');
		db.execute('DELETE FROM otherDriver WHERE time="' + escape(time) + '"');
		for ( i = 0; i < blob.length; i++) {
			var identifier = blob[i].name + blob[i].phone + blob[i].emailId + blob[i].carRegistration;
			db.execute('INSERT INTO otherDriver (time,id,name,phone,emailId,carRegistration,description,injury) VALUES(?,?,?,?,?,?,?,?)', escape(time), escape(identifier), escape(blob[i].name), blob[i].phone, escape(blob[i].emailId), escape(blob[i].carRegistration), escape(blob[i].description),escape(blob[i].injury));
		}
		db.close();
	};
	
	DatabaseInteraction.deleteDriversForIncident = function(time) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS otherDriver (time TEXT,id TEXT,name TEXT,phone TEXT,emailId TEXT,carRegistration TEXT,description TEXT,injury TEXT)');
		db.execute('DELETE FROM otherDriver WHERE time="'+escape(time)+'"');
		db.close();
	};
	
	DatabaseInteraction.getOtherDriversFor = function(id) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS otherDriver (time TEXT,id TEXT,name TEXT,phone TEXT,emailId TEXT,carRegistration TEXT,description TEXT,injury TEXT)');
		
		var holddatavar = db.execute('SELECT * FROM otherDriver WHERE time="' + escape(id) + '"');
		
		var arrayToReturn = [];

		while (holddatavar.isValidRow()) 
		{
			var blob = {
				time : unescape( holddatavar.fieldByName('time') ),
				id : unescape( holddatavar.fieldByName('id') ),
				name : unescape(holddatavar.fieldByName('name')),
				phone : holddatavar.fieldByName('phone'),
				emailId : unescape(holddatavar.fieldByName('emailId')),
				carRegistration : unescape(holddatavar.fieldByName('carRegistration')),
				description : unescape(holddatavar.fieldByName('description')),
				injury : unescape(holddatavar.fieldByName('injury')),
			};
			arrayToReturn.push(blob);
			holddatavar.next();
		}
		holddatavar.close();
		db.close();
		return arrayToReturn;
	};
	
	

	DatabaseInteraction.addWitnesses = function(blob, time) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS witnesses (time TEXT,id TEXT,name TEXT,phone TEXT,emailId TEXT)');
		db.execute('DELETE FROM witnesses WHERE time="' + escape(time) + '"');
		for ( i = 0; i < blob.length; i++) {
			var identifier = blob[i].name + blob[i].phone + blob[i].emailId;
			db.execute('INSERT INTO witnesses (time,id,name,phone,emailId) VALUES(?,?,?,?,?)', escape(time), escape(identifier), escape(blob[i].name), blob[i].phone, escape(blob[i].emailId));
		}
		db.close();
	};
	
	DatabaseInteraction.deleteWitnessForIncident = function(time) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS witnesses (time TEXT,id TEXT,name TEXT,phone TEXT,emailId TEXT)');
		db.execute('DELETE FROM witnesses WHERE time="'+escape(time)+'"');
		db.close();
	};
	
	DatabaseInteraction.getWitnessesFor = function(id) {
		var db = Titanium.Database.open(Alloy.Globals.databaseVersion);
		db.execute('CREATE TABLE IF NOT EXISTS witnesses (time TEXT,id TEXT,name TEXT,phone TEXT,emailId TEXT)');
		
		var holddatavar = db.execute('SELECT * FROM witnesses WHERE time="' + escape(id) + '"');
		
		var arrayToReturn = [];

		while (holddatavar.isValidRow()) 
		{
			var blob = {
				time : unescape( holddatavar.fieldByName('time') ),
				id : unescape( holddatavar.fieldByName('id') ),
				name : unescape(holddatavar.fieldByName('name')),
				phone : holddatavar.fieldByName('phone'),
				emailId : unescape(holddatavar.fieldByName('emailId')),
			};
			arrayToReturn.push(blob);
			holddatavar.next();
		}
		holddatavar.close();
		db.close();
		return arrayToReturn;
	};

})();

exports.database = DatabaseInteraction;
