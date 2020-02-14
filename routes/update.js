var express = require('express');
var router = express.Router();
// var downloader = require('../js/downloader.js')
var googleHelper = require('../js/dl/googleDownloader.js')
var spotifyHelper = require('../js/dl/spotifyDownloader.js')
var rennlistHelper = require('../js/dl/rennlistDownloader.js')
var mongoHelper = require('../js/dl/mongoDownloader.js')


router.get('/onepage', function(req, res, next) {
	var googleResults
	var spotifyResults
	var playlistUri = process.env.spotify_onepage_playlist_uri

	if (req.session.passport && req.session.passport.user.spotify) {
		req.session.return = ''

		// spotifyHelper.getSpotifyPlaylistData(req, playlistUri)
		// 	.then(data => res.json(data))
		var googlePromise = googleHelper.getOnePageData()
		.then(res => {
			return res
		})
		// console.log(googleHelper)
		var spotifyPromise = spotifyHelper.getSpotifyPlaylistData(req, playlistUri)
			.then(res => {
			return res
		})

		return Promise.all([googlePromise, spotifyPromise]).then(results => {
			googleResults = results[0]
				.map(f => f.name.replace('[DRAFT] ',''))
				.filter(n => !n.match(/\[(HOLIDAY|TEMPLATE|'Copy')\]/g))
			spotifyResults = results[1]
				// .map(i => i.artists.join(', ') + ' - ' + i.name.split(' - ')[0]).sort()
				.map(i => i.artists[0] + ' - ' + i.name.split(' - ')[0]).sort()
			
			// console.log(googleResults)
			// console.log(spotifyResults)
			return(googleResults.filter(g => !spotifyResults
				.map(sp => sp.split(' - ')[1].replace(/[\W]/g, '').toLowerCase())
				.includes(g.split(' - ')[1].replace(/[\W]/g, '').toLowerCase())))
		}).then(onePagesToAdd => {
			console.log(onePagesToAdd)
			return Promise.all(onePagesToAdd.map(p => spotifyHelper.getSpotifySearchResults(req, p.replace(' - ', ' '))
				.then(rslt => {
					var matches = rslt.body.tracks.items.filter(t => {
						var spotifyTrackName = t.name.replace(/[\W]/g, '').toLowerCase()
						var onePageTrackName = p.split(' - ')[1].replace(/[\W]/g, '').toLowerCase()
						return spotifyTrackName.indexOf(onePageTrackName) > -1
					})[0]
					
					// console.log(rslt.body.tracks.items)
					// console.log(matches)
					return matches
				})
			))
		})
		.then(searchResults => {
			var trackUris = searchResults.filter(s => s !== undefined).map(s => s.uri)
			// console.log(trackUris.length)
			if (trackUris.length > 0) {
				spotifyHelper.addTracksToSpotifyPlaylist(req, playlistUri, trackUris).catch(err=>console.log(err))
			}
			res.json(searchResults)
		})
	}
	else
	{
		req.session.return = '/update/onepage'
		res.redirect('/auth/spotify')
	}

})

router.get('/onepage/starred', function(req, res, next) {
	var googleResults
	var spotifyResults
	var playlistUri = process.env.spotify_onepage_starred_playlist_uri

	if (req.session.passport && req.session.passport.user.spotify) {
		req.session.return = ''

		// spotifyHelper.getSpotifyPlaylistData(req, playlistUri)
		// 	.then(data => res.json(data))
		var googlePromise = googleHelper.getStarredOnePageData()
		.then(res => {
			return res
		})
		// console.log(googleHelper)
		var spotifyPromise = spotifyHelper.getSpotifyPlaylistData(req, playlistUri)
			.then(res => {
			return res
		})

		return Promise.all([googlePromise, spotifyPromise]).then(results => {
			googleResults = results[0]
				.map(f => f.name.replace('[DRAFT] ',''))
				.filter(n => !n.match(/\[(HOLIDAY|TEMPLATE|'Copy')\]/g))
			spotifyResults = results[1]
				// .map(i => i.artists.join(', ') + ' - ' + i.name.split(' - ')[0]).sort()
				.map(i => i.artists[0] + ' - ' + i.name.split(' - ')[0]).sort()
			
			// console.log(googleResults)
			// console.log(spotifyResults)
			return(googleResults.filter(g => !spotifyResults
				.map(sp => sp.split(' - ')[1].replace(/[\W]/g, '').toLowerCase())
				.includes(g.split(' - ')[1].replace(/[\W]/g, '').toLowerCase())))
		}).then(onePagesToAdd => {
			console.log(onePagesToAdd)
			return Promise.all(onePagesToAdd.map(p => spotifyHelper.getSpotifySearchResults(req, p.replace(' - ', ' '))
				.then(rslt => {
					var matches = rslt.body.tracks.items.filter(t => {
						var spotifyTrackName = t.name.replace(/[\W]/g, '').toLowerCase()
						var onePageTrackName = p.split(' - ')[1].replace(/[\W]/g, '').toLowerCase()
						return spotifyTrackName.indexOf(onePageTrackName) > -1
					})[0]
					
					// console.log(rslt.body.tracks.items)
					// console.log(matches)
					return matches
				})
			))
		})
		.then(searchResults => {
			var trackUris = searchResults.filter(s => s !== undefined).map(s => s.uri)
			// console.log(trackUris.length)
			if (trackUris.length > 0) {
				spotifyHelper.addTracksToSpotifyPlaylist(req, playlistUri, trackUris).catch(err=>console.log(err))
			}
			res.json(searchResults)
		})
	}
	else
	{
		req.session.return = '/update/onepage'
		res.redirect('/auth/spotify')
	}

})

router.get('/rennlist/recent', function(req, res, next) {
	rennlistHelper.addMostRecent().then(data => {
		console.log(data)
		res.json(data)
	})
})

router.get('/rennlist/all', function(req, res, next) {
	rennlistHelper.updateAll().then(data => {
		console.log(data)
		res.json(data)
	})
})

router.get('/rennlist/url', function(req, res, next) {
	var url = req.query.url
	rennlistHelper.updateUrl(url).then(data => {
		console.log(data)
		res.json(data)
	})
})

router.get('/cars/normalize', function(req, res, next) {
	// var url = req.query.url
	// normalized_fields = ['_turbo', '_cabriolet']
	var rules = [
		// {

		// },
		// {

		// }
	]
	// rennlistHelper.updateUrl(url).then(data => {
	// 	console.log(data)
	// 	res.json(data)
	// })
})
module.exports = router;
