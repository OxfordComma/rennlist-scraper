var express = require('express');
var router = express.Router();
// var downloader = require('../js/downloader.js')
var googleHelper = require('../js/dl/googleDownloader.js')
var spotifyHelper = require('../js/dl/spotifyDownloader.js')
var rennlistHelper = require('../js/dl/rennlistDownloader.js')


router.get('/onepage', function(req, res, next) {
	var googleResults
	var spotifyResults
	var playlistUri = process.env.spotify_playlist_uri
	if (!req.session.passport || !req.session.passport.user.spotify) {
		req.session.return = '/update/onepage'
		console.log(req.session)
		res.redirect('/auth/spotify')
	} 
	else {
		var googlePromise = googleHelper.getOnePageData()
		.then(res => {
			return res
		})

		var spotifyPromise = spotifyHelper.getSpotifyPlaylistData(req, process.env.spotify_playlist_uri)
			.then(res => {
			return res
		})

		return Promise.all([googlePromise, spotifyPromise]).then(results => {
			googleResults = results[0]
				.map(f => f.name.replace('[DRAFT] ',''))
				.filter(n => !n.match(/\[(HOLIDAY|TEMPLATE|'Copy')\]/g))
			spotifyResults = results[1]
				.map(i => i.artists.join(', ') + ' - ' + i.name.split(' - ')[0]).sort()
			
			return(googleResults.filter(g => !spotifyResults.includes(g)))
		}).then(onePagesToAdd => {

			return Promise.all(onePagesToAdd.map(p => spotifyHelper.getSpotifySearchResults(req, p.replace(' - ', ' '))
				.then(rslt => {
					var matches = rslt.body.tracks.items.filter(t => t.name.indexOf(p.split(' - ')[1]) > -1)[0]
					return matches
				})
			))
		})
		.then(searchResults => {
			var trackUris = searchResults.filter(s => s !== undefined).map(s => s.uri)
			console.log(trackUris.length)
			if (trackUris.length > 0) {
				spotifyHelper.addTracksToSpotifyPlaylist(req, playlistUri, trackUris).catch(err=>console.log(err))
			}
			res.json(onePagesToAdd)
		})
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

module.exports = router;
