var express = require('express');
var router = express.Router();
var mongoHelper = require('../js/dl/mongoDownloader.js')


router.get('/google/onepages', function(req, res, next) {
	downloader.getOnePageData().then(data => res.json(data))
})

router.get('/spotify/recent', function(req, res, next) {
	
	if (req.session.passport && req.session.passport.user.spotify) {
		req.session.return = ''

		downloader.getSpotifyRecentData(req)
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

		downloader.getSpotifyPlaylistData(req, playlistUri)
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


	// if (req.session.passport && req.session.passport.user.lastfm) {
	// 	req.session.return = ''

		downloader.getLastFMData(req, username)
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
