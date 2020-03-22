var express = require('express');
var router = express.Router();

var googleHelper = require('../js/dl/googleDownloader.js')
var spotifyHelper = require('../js/dl/spotifyDownloader.js')
var mongoHelper = require('../js/dl/mongoDownloader.js')
var lastFMHelper = require('../js/dl/lastFMDownloader.js')



router.get('/google/onepages/all', function(req, res, next) {
	googleHelper.getOnePageData().then(data => res.json(data))
})

router.get('/google/onepages/starred', function(req, res, next) {
	googleHelper.getStarredOnePageData().then(data => res.json(data))
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
			.then(data => {
				res.json(data)
			})
	}
	else
	{
		req.session.return = '/data/spotify/playlist?playlistUri='+playlistUri
		res.redirect('/auth/spotify')
	}
})

// router.get('/user', function(req, res, next) {
// 	console.log(req.session)
// 	mongoHelper.getUsernameFromDb(req.query.username)
// 		.then(data => {
// 			console.log(data)
// 			if (data.length == 0) {
// 				mongoHelper.createUser(req.query.username)
// 			}
// 			res.json(data)
// 		})
// })



router.get('/lastfm', function(req, res, next) {
	var username = req.query.username
	lastFMHelper.getLastFMData(req, username, 1, 25)
		.then(data => res.json(data))
})

router.get('/lastfm/onemonth', function(req, res, next) {
	var username = req.query.username
	lastFMHelper.getOneMonth(req, username)
		.then(data => {
			// console.log(data)
			res.json(data)
		})
})

router.get('/cars/porsche', function(req, res, next) {
	mongoHelper.getMongoCollection('cl_cars', 'porsche_normalized')
		.then(db => db.find().toArray())
		.then(data => res.json(data))
		.catch(err => console.log(err))
})


module.exports = router;
