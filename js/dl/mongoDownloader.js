const MongoClient = require('mongodb').MongoClient;

// MONGO
let getMongoClient = () => {
	const uri = process.env.mongo_uri
	var options = { useNewUrlParser: true, useUnifiedTopology: true }
	const mongoClient = new MongoClient(uri, options);
	return mongoClient
}

let getMongoCollection = (dbName, collectionName) => {
	const mongoClient = getMongoClient()
	return new Promise((resolve, reject) => {
		mongoClient.connect((err, db) => {
			if (err) {
				reject(err);
			} else {
				resolve(db.db(dbName).collection(collectionName));
			}
		});
	}).catch(err => console.log(err));
}


let getPorscheData = () => {
	return getMongoCollection('cl_cars', 'porsche').then(db => db.find().toArray())
}

let getUsernameFromDb = (username) => {
	return getMongoCollection('music', 'lastfm').then(db => db.find({ username: username }).toArray())
}

module.exports = {
	getPorscheData: getPorscheData,
	getUsernameFromDb: getUsernameFromDb,
	getMongoCollection: getMongoCollection
}