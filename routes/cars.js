var express = require('express');
var axios = require('axios');
var $ = require('cheerio');
var router = express.Router();
// var creds = require('../credentials.json')

const baseUrl = 'https://rennlist.com/forums/market/vehicles/porsche-2/2005-2012?sortby=dateline_desc&intent%5B2%5D=2&modelid%5B0%5D=m10&modelid%5B1%5D=m2834&status%5B0%5D=0&type%5B0%5D=1&filterstates%5Bvehicle_sellertype%5D=0&filterstates%5Bvehicle_types%5D=1&filterstates%5Bvehicle_statuses%5D=1&filterstates%5Bvehicle_condition%5D=0&filterstates%5Bvehicle_price%5D=0&filterstates%5Bvehicle_mileage%5D=0&filterstates%5Bvehicle_location%5D=0&filterstates%5Bvehicle_color%5D=0&filterstates%5Bvehicle_vehicletype%5D=0&filterstates%5Bvehicle_engine%5D=0&filterstates%5Bvehicle_transmission%5D=0&page='
const dbName = "cl_cars"
const collectionName = "porsche"

let getPageUrls = (pageUrl) => {
	pageUrl = baseUrl + page.toString()
	return axios.get(pageUrl)
		.then(response => {
			console.log(response)
			return $('#search-result-vehicle h3.title > a', response.data)
				.map(function() { return $(this)[0].attribs.href }).get();
		})
}

let getDetailedData = (porscheUrl) => {
	return axios.get(porscheUrl).then(response => {
		var specs = $('.specs-list > li', response.data)
			.map(function() { return $(this).text() }).get();
		var detailed_description = $('.tcell p', response.data)
			.map(function() { return $(this).text() }).get();
		var post_time = $('small > strong', response.data)
			.map(function() { return $(this).text() }).get();
		var thread_title = $('.threadtitle', response.data)
			.map(function() { return $(this).text() }).get();
		var thread_subtitle = $('.threadsubtitle', response.data)
			.map(function() { return $(this).text() }).get();

		specs = specs.map(s => s.replace(/[\t•]/g, '').split('\n').filter(n => n))

		var price = specs.filter(s => s[0] == 'Price')[0]
		var location = specs.filter(s => s[0] == 'Location')[0]
		var condition = specs.filter(s => s[0] == 'Condition')[0]
		var vin = specs.filter(s => s[0] == 'VIN')[0]
		var mileage = specs.filter(s => s[0] == 'Mileage')[0]
		// var engine = specs.filter(s => s[0] == 'Engine')[0]
		var drive = specs.filter(s => s[0] == 'Drive Type')[0]
		var trans = specs.filter(s => s[0] == 'Transmission')[0]
		// var type = specs.filter(s => s[0] == 'Vehicle Type')[0]
		var color = specs.filter(s => s[0] == 'Exterior Color')[0]
		
		location = location[1].split(',')
		thread_subtitle = thread_subtitle[0].split(' ')
		var car = {
			url: porscheUrl,
			city: location[0].trim(),
			state: location[1].trim(),
			country: location[2].trim(),
			info: thread_title[0],
			year: parseInt(thread_subtitle[0]),
			make: thread_subtitle[1],
			model: thread_subtitle[2],
			price: parseInt(price[1].replace(/[$,]/g, '')),
			mileage: mileage !== undefined ? parseInt(mileage[1].replace(',', '')) : 'unknown',
			condition: condition !== undefined ? condition[1] : 'unknown',
			drive: drive !== undefined ? drive[1] : 'unknown',
			transmission: trans !== undefined ? trans[1] : 'unknown',
			color: color !== undefined ? color[1].toLowerCase() : 'unknown',
			vin: vin !== undefined ? vin[1] : 'unknown',
			detailed_description: detailed_description[0],
			post_time: new Date(post_time[0]),
			url_key : parseInt(porscheUrl.split('/').pop()),
			turbo: thread_title[0].match(/turbo|99\dtt/i) ? true : false,
			cabriolet: thread_title[0].match(/cab|vert/i) ? true : false,
			last_updated: new Date()

		}
		console.log(car.info)

		return car
	})
}


let getMaxNumOfRennlistPages = () => {
	return axios.get(baseUrl+'1')
		.then(response => {
			var pages = $('.tcell .vbmenu_control', response.data)
				.map(function() { return $(this).text() }).get();
			var maxPages = +pages[0].split(' ')[3]
			console.log('maxPages: ' + maxPages.toString())
			return maxPages
		})
}


let getMongoClient = () => {
	const MongoClient = require('mongodb').MongoClient;
	const uri = process.env.uri || require('../credentials.json')['mongo_uri'];
	console.log(uri)
	const client = new MongoClient(uri, { useNewUrlParser: true });
	return client
}

let getMongoData = () => {
	const client = getMongoClient()
	return new Promise((resolve, reject) => {
		client.connect((err, db) => {
			if (err) {
				reject(err);
			} else {
				resolve(db.db(dbName).collection(collectionName).find().toArray());
			}
		});
	}).catch(err => console.log(err));
}


let updateAll = () => {
	return getMaxNumOfRennlistPages()
		.catch(err => console.log(err)).then(maxPages => {
		var urls = []
		// maxPages = 1
		for (var i = 1; i <= maxPages; i++){
			urls.push(baseUrl + i.toString())
		}
		return urls
	}).then(urls => {
		// console.log(urls)
		return Promise.all(urls.map(u => getPageUrls(u))).then(urls => urls.flat())
	}).then(rennlistUrls => {
		var client = getMongoClient()
		return new Promise((response, reject) => {
			client.connect(err => {
				if (err) throw err;

				const collection = client.db(dbName).collection(collectionName);
				response(
					Promise.all(rennlistUrls.map(u => getDetailedData(u))).then(cars => {
						cars.forEach(car => {
							collection.updateOne({ url: car.url}, {$set: car}, {upsert: true})
						})
						console.log(cars.flat())
						return cars.flat()
					})
				)
			})
		})
	})	
}

let addMostRecent = () => {
	return getMaxNumOfRennlistPages()
		.catch(err => console.log(err)).then(maxPages => {
		var urls = []
		for (var i = 1; i <= maxPages; i++){
			urls.push(baseUrl + i.toString())
		}
		return urls
	}).then(urls => {
		// console.log(urls)
		return Promise.all(urls.map(u => getPageUrls(u))).then(urls => urls.flat())
	}).then(rennlistUrls => {
		var client = getMongoClient()
		return new Promise((response, reject) => {
			client.connect(err => {
				if (err) throw err;

				const collection = client.db(dbName).collection(collectionName);
				response(collection.distinct('url').then(mongoUrls => {

					var urlsToAdd = rennlistUrls.filter(r => !mongoUrls.includes(r))

					return Promise.all(urlsToAdd.map(u => getDetailedData(u))).then(cars => {
						cars.forEach(car => {
							collection.updateOne({ url: car.url}, {$set: car}, {upsert: true})
						})
						console.log(cars.flat())
						return cars.flat()
					})
				}))
			})
		})
	})	
}


router.get('/', function(req, res, next) {
	getMongoData().then(carList => {
		res.render('997', cars=carList)
		res.end()
	})
});

router.get('/porsche/data/upload/recent', function(req, res, next) {
	addMostRecent().then(carList => {
		res.json(carList)
	})
})

router.get('/porsche/data/upload/all', function(req, res, next) {
	updateAll().then(carList => {
		res.json(carList)
	}).catch(err => console.log(err))
})

router.get('/porsche/data/download', function(req, res, next) {
	getMongoData().then(data => {
		// console.log('data')
		res.json(data)
	}).catch(err => console.log(err))
});

module.exports = router;
