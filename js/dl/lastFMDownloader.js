var LastFmNode = require('lastfm').LastFmNode;
var mongoHelper = require('./mongoDownloader.js')
// LASTFM

let getLastFmAuth = () => {
	var lastFmAuth = new LastFmNode({
		api_key: process.env.lastfm_api_key,
		secret: process.env.lastfm_secret
	});
	return lastFmAuth
}

let getOneMonth = (req, username) => {
	// var fromDate = new Date(new Date().setDate(new Date().getDate()-365))
	var fromDate = new Date(new Date().setDate(new Date().getDate()-30))
	// console.log(fromDate)
	
	var lastFmAuth = getLastFmAuth()


	let getNext = (page, accum) => {
		var options = {
			user: username,
			page: page,
			limit: 200,
			from: fromDate
		}
		return new Promise((resolve, reject) => {
			options['handlers'] = {
				success: function(data) {
					resolve(data);
				},
				error: function(error) {
					reject(error);
				}
			}
			lastFmAuth.request('user.getRecentTracks', options)
		}).then(data => {

			var tracks = data.recenttracks.track.map(i => {
				return {
					artists: [i.artist['#text']],
					album: i.album['#text'],
					name: i.name,
					listen_date: i.date ? new Date(i.date['#text']) : new Date()
				}
			})
			accum = accum.concat(tracks)
			// console.log(tracks)
			var oldestDate = tracks.sort((a, b) => a.listen_date - b.listen_date)[0].listen_date
			// console.log(oldestDate)
			if (oldestDate > fromDate) {
				return getNext(page+1, accum)
			}
			else
			{
				return accum
			}
		})
	}
	return getNext(1, [])
		// .then(data => {
			// console.log(data)
			// return data
		// })
}


let getLastFMData = (req, username, fromPage, toPage) => {
	// var pageLimit = pages
	// var lastFmAuth = getLastFmAuth(req.session.passport.user.lastfm)
	var lastFmAuth = getLastFmAuth()

	// var items = []
	let getNext = (page) => {
		var options = {
			user: username,
			page: page,
			limit: 200
		}
		return new Promise((resolve, reject) => {
			options['handlers'] = {
				success: function(data) {
					resolve(data);
				},
				error: function(error) {
					reject(error);
				}
			}
			lastFmAuth.request('user.getRecentTracks', options)
		}).then(data => {
			return data.recenttracks.track.map(i => {
				return {
					artists: [i.artist['#text']],
					album: i.album['#text'],
					name: i.name,
					listen_date: i.date ? new Date(i.date['#text']) : new Date()
				}
			})
		})
	}
	var promises = []
	for (var i = fromPage; i <= toPage; i++) {
		promises.push(getNext(i))
	}
	return Promise.all(promises).then(data => {
		return data
			.reduce((acc, curr) => acc.concat(curr), [])
			.sort((a, b) => a.listen_date - b.listen_date)
	})
}

module.exports = {
	getLastFMData: getLastFMData,
	getOneMonth: getOneMonth
}
