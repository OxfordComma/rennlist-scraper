var express = require('express');
var router = express.Router();

var googleHelper = require('../js/dl/googleDownloader.js')
var spotifyHelper = require('../js/dl/spotifyDownloader.js')
var mongoHelper = require('../js/dl/mongoDownloader.js')
var lastFMHelper = require('../js/dl/lastFMDownloader.js')



router.get('/google/onepages', function(req, res, next) {
	googleHelper.getOnePageData().then(data => res.json(data))
})

router.get('/spotify/recent', function(req, res, next) {
	
	if (req.session.passport && req.session.passport.user.spotify) {
		req.session.return = ''

		spotifyHelper.getSpotifyRecentData(req)
			.then(data => res.json(data))
	}
	else {
		req.session.return = '/data/spotify/recent'
		res.redirect('/auth/spotify')
	}
});

router.get('/spotify/playlist', function(req, res, next) {
	var playlistUri = req.query.playlistUri

	if (!playlistUri) 
		res.send('No playlist uri')

	if (req.session.passport && req.session.passport.user.spotify) {
		req.session.return = ''

		spotifyHelper.getSpotifyPlaylistData(req, playlistUri)
			.then(data => res.json(data))
	}
	else
	{
		req.session.return = '/data/spotify/playlist?playlistUri='+playlistUri
		res.redirect('/auth/spotify')
	}
})



router.get('/lastfm', function(req, res, next) {
	// console.log(req)
	var username = req.query.username
	var pages = req.query.pages

	
	// if (req.session.passport && req.session.passport.user.lastfm) {
	// 	req.session.return = ''

		lastFMHelper.getLastFMData(req, username, pages)
			.then(data => res.json(data))
	// }
	// else {
	// 	req.session.return = '/data/lastfm?username='+username
	// 	res.redirect('/auth/lastfm')
	// }
})

router.get('/porsche', function(req, res, next) {
	mongoHelper.getPorscheData().then(data => {
		res.json(data)
	}).catch(err => console.log(err))
})


module.exports = router;
