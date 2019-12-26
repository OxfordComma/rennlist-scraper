var LastFmNode = require('lastfm').LastFmNode;
// LASTFM

let getLastFmAuth = () => {
	var lastFmAuth = new LastFmNode({
		api_key: process.env.lastfm_api_key,
		secret: process.env.lastfm_secret
	});
	return lastFmAuth
}


let getLastFMData = (req, username) => {
	var pageLimit = 1
	var options = {
		user: username,
		page: 1,
		limit: 200
	}
	// var lastFmAuth = getLastFmAuth(req.session.passport.user.lastfm)
	var lastFmAuth = getLastFmAuth()


	var items = []
	let getNext = () => {
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
			console.log(data)
			var tracks = data.recenttracks.track.map(i => {
				return {
					artists: [i.artist['#text']],
					album: i.album['#text'],
					name: i.name,
					listen_date: new Date(i.date['#text'])
				}
			})
			items.push.apply(items, tracks)
			// console.log(items)
			options.page = options.page+1
			if (options.page < pageLimit)
				return getNext()
			else
				return items
		})
	}
	
	return getNext().catch(err => console.log(err))
	// .then(data => console.log	(data))
	// .then(data => res.json(data))
}

module.exports = {
	getLastFMData: getLastFMData,
	
}
