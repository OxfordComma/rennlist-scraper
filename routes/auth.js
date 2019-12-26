var express = require('express');
var router = express.Router();
var passport = require('passport')

var GoogleStrategy = require('passport-google-oauth2').Strategy
var SpotifyStrategy = require('passport-spotify').Strategy;
var LastFmStrategy = require('passport-lastfm')

passport.use(
	new GoogleStrategy({
		clientID:  process.env.google_client_id, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
		clientSecret: process.env.google_client_secret, // e.g. _ASDFA%DFASDFASDFASD#FAD-
		callbackURL: 'https://localhost:3000/auth/google/callback',
		scope: ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/userinfo.email'],
		passReqToCallback: true,
		authType: 'rerequest', 
		// accessType: 'offline', 
		// prompt: 'consent', 
		includeGrantedScopes: true
	},
	function(request, accessToken, refreshToken, profile, done) { 
		// console.log(profile)
		return done(null, {
			google: {
				accessToken: accessToken,
				refreshToken: refreshToken,
				email: profile.email
			}
		});
	}
));

passport.use(
	new SpotifyStrategy({
		clientID: process.env.spotify_client_id,
		clientSecret: process.env.spotify_client_secret,
		callbackURL: '/auth/spotify/callback',
		scope: ['playlist-modify-public', 'user-read-recently-played']
	},
	function(accessToken, refreshToken, expires_in, profile, done) {
		return done(null, {
			spotify: {
				accessToken: accessToken,
				refreshToken: refreshToken,
				id: profile.id
			}
		});
	})
);

passport.use(
	new LastFmStrategy({
		'api_key': process.env.lastfm_api_key,
		'secret': process.env.lastfm_secret,
		'callbackURL': 'https://localhost:3000/auth/lastfm/callback'
	},
	function(req, sessionKey, done) {
		return done(null, {
			lastfm: {
				apiKey: sessionKey
				// user: req.user
			}
		})
	})
)

passport.serializeUser(function(user, cb) {
	// console.log(user)
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	// db.users.findById(id, function (err, user) {
	//   if (err) { return cb(err); }
		cb(null, obj);
	// });
});

router.get('/google', passport.authenticate('google', {
		prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
		// scope: ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/userinfo.email'],
		// authType: 'rerequest', 
		accessType: 'offline'
		// includeGrantedScopes: true
		})
	);

router.get('/google/callback', passport.authenticate('google'),
	function(req, res, next) {
		res.redirect(req.session.return)
	}
)

router.get('/spotify', passport.authenticate('spotify'));

router.get('/spotify/callback', passport.authenticate('spotify'),
	function(req, res, next) {
		res.redirect(req.session.return)
	}
)


router.get('/lastfm', passport.authenticate('lastfm'))

router.get('/lastfm/callback', passport.authenticate('lastfm'),
	function(req, res, next) {
		res.redirect(req.session.return)
	})

module.exports = router;
