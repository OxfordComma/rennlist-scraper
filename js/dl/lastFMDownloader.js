var LastFmNode = require('lastfm').LastFmNode;
// LASTFM

// Only need the API key for this one
// so just pull from env
let getLastFmAuth = () => {
	return new LastFmNode({
		api_key: process.env.lastfm_api_key,
		secret: process.env.lastfm_secret
	});
}

let getOneMonth = (req, username) => {
	var fromDate = new Date(new Date().setDate(new Date().getDate()-30))

	var lastFmAuth = getLastFmAuth()

	let getNext = (page, accum) => {
		var options = {
			user: username,
			page: page,
			limit: 200,
			from: fromDate
		}
		// Turns this auth into a promise
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
			// If the oldest date is newer than the searched date, 
			// get the next page
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
}


let getLastFMData = (req, username, fromPage, toPage) => {
	var lastFmAuth = getLastFmAuth()

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
