var creds = require('./credentials.json')
var axios = require('axios')

let getMaxNumOfRennlistPages = () => {
		return axios.get(creds.baseUrl+'1')
			.then(response => {
				var pages = $('.tcell .vbmenu_control', response.data)
					.map(function() { return $(this).text() }).get();
				var maxPages = +pages[0].split(' ')[3]
				console.log('maxPages: ' + maxPages.toString())
				return maxPages
			})
	}

module.exports = {
	getPageUrls: (pageUrl) => {
		pageUrl = creds.baseUrl + page.toString()
		return axios.get(pageUrl)
			.then(response => {
				console.log(response)
				return $('#search-result-vehicle h3.title > a', response.data)
					.map(function() { return $(this)[0].attribs.href }).get();
			})
	},

	getDetailedData: (porscheUrl) => {
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
	},


	getMongoClient: () => {
		const MongoClient = require('mongodb').MongoClient;
		const uri = process.env.uri || creds['mongo_uri'];
		// console.log(uri)
		const client = new MongoClient(uri, { useNewUrlParser: true });
		return client
	},

	getMongoData: (client) => {
		// const client = getMongoClient()
		return new Promise((resolve, reject) => {
			client.connect((err, db) => {
				if (err) {
					reject(err);
				} else {
					resolve(db.db(creds['db_name']).collection(creds['collection_name']).find().toArray());
				}
			});
		}).catch(err => console.log(err));
	},


	updateAll: (client) => {
		return getMaxNumOfRennlistPages()
			.catch(err => console.log(err)).then(maxPages => {
			var urls = []
			// maxPages = 1
			for (var i = 1; i <= maxPages; i++){
				urls.push(creds.baseUrl + i.toString())
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

					const collection = client.db(creds.dbName).collection(creds.collectionName);
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
	},

	addMostRecent: (client) => {
		return getMaxNumOfRennlistPages()
			.catch(err => console.log(err)).then(maxPages => {
			var urls = []
			for (var i = 1; i <= maxPages; i++){
				urls.push(creds.baseUrl + i.toString())
			}
			return urls
		}).then(urls => {
			// console.log(urls)
			return Promise.all(urls.map(u => getPageUrls(u))).then(urls => urls.flat())
		}).then(rennlistUrls => {
			// var client = getMongoClient()
			return new Promise((response, reject) => {
				client.connect(err => {
					if (err) throw err;
					// console.log(creds)
					const collection = client.db(creds['db_name']).collection(creds['collection_name']);
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
}


