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


let getLastFMData = (req, username, pages) => {

	mongoHelper.getUsernameFromDb(username).then(i => console.log(i))

	var pageLimit = pages
	var options = {
		user: username,
		page: 1,
		limit: 200
	}
	// var lastFmAuth = getLastFmAuth(req.session.passport.user.lastfm)
	var lastFmAuth = getLastFmAuth()


	var items = []
	let getNext = (opts) => {
		return new Promise((resolve, reject) => {
			options['handlers'] = {
				success: function(data) {
					resolve(data);
				},
				error: function(error) {
					reject(error);
				}
			}
			lastFmAuth.request('user.getRecentTracks', opts)
		})
	}

	return getNext(options).then(data => {
		// console.log(data)
		// items = data

		var promises = [getNext(options)]
		while (promises.length < pageLimit) {
			options.page = promises.length + 1
			promises.push(getNext(options))
		}
		return Promise.all(promises)
	}).then(data => {
		// console.log(data)
		var tracks = data.reduce((acc, curr) => {
			// console.log(acc)
			return acc.concat(curr.recenttracks.track)
		}, [])
		var tracks_formatted = tracks.map(i => {
			// console.log(i)
			return {
				artists: [i.artist['#text']],
				album: i.album['#text'],
				name: i.name,
				listen_date: i.date ? new Date(i.date['#text']) : new Date()
			}
		})
		// console.log(items)
		// console.log(tracks_formatted)
		items.push.apply(items, tracks_formatted)
			// console.log(items)
			// options.page = options.page+1
			// if (options.page < pageLimit)
			// 	return getNext()
			// else
		return items
	})
	// }


	
	// return getNext().catch(err => console.log(err))
	// .then(data => console.log	(data))
	// .then(data => res.json(data))
}

module.exports = {
	getLastFMData: getLastFMData,
	
}
