var express = require('express');
var axios = require('axios');
var $ = require('cheerio');
var router = express.Router();
var googleapis = require('googleapis')
var SpotifyWebApi = require('spotify-web-api-node');

var creds = try {
	require('./spotify_credentials.json')
} catch (err) => {
	console.log(err)
}


const google = googleapis.google
var googleAuth, spotifyAuth;

const googleConfig = {
  clientId: process.env.google_client_id || creds['google']['client_id'], // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: process.env.google_client_secret || creds['google']['client_secret'], // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: process.env.google_redirect_uri || creds['google']['redirect_uri'] // this must match your google api settings
};

function createGoogleConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function createSpotifyConnection() {
	return new SpotifyWebApi({
	  clientId: process.env.spotify_client_id || creds['spotify']['client_id'],
	  clientSecret: process.env.spotify_client_secret || creds['spotify']['client_secret'],
	  redirectUri: process.env.spotify_redirect_uri || creds['spotify']['redirect_uri']
	});
}

function getGoogleConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly'
  })
}

function getSpotifyConnectionUrl(auth) {
	var scopes = ['playlist-modify-public']
  const url = auth.createAuthorizeURL(scopes)
  return url;
}

function urlGoogle() {
  var auth = createGoogleConnection(); // this is from previous step
  const url = getGoogleConnectionUrl(auth);
  return url;
}

function urlSpotify() {
	var auth = createSpotifyConnection();
	const url = getSpotifyConnectionUrl(auth)
	return url;
}

function getGoogleDriveApi(auth) {
  // return google.plus({ version: 'v1', auth });
  return google.drive({ version: 'v3', auth })
}

function getSpotifyApi(auth) {
	// return spotifyApi.
}

router.get('/update/onepage', function(req, res, next) {
	var playlistUri = creds['spotify']['playlist_uri']

	if (!googleAuth) {
		res.redirect(urlGoogle())
	}
	else if (!spotifyAuth) {
		res.redirect(urlSpotify())
	}
	else if (spotifyAuth && googleAuth) {
		const drive = getGoogleDriveApi(googleAuth);
		const googlePromise = new Promise((resolve, reject) => {
	  	drive.files.list({
		  	q: "'0B7wQpwvNx4sTUVZKMFFIVFByakE' in parents",
		  	orderBy: 'modifiedTime desc',
		  	pageSize: 1000
		  }, (err, result) => {
		  	var files = result.data.files
		  	console.log(files.length)
		  	var onePages = 
		  	files
		  		.map(f => f.name.replace('[DRAFT] ',''))
	  			.filter(n => !n.match(/\[(HOLIDAY|TEMPLATE|'Copy')\]/g))

  			resolve(onePages.sort())
  		})
	  })

  	const spotifyPromise = new Promise((resolve, reject) => {
  		var spotifyApi = spotifyAuth
			var options = { limit: 100, offset: 0 }
			spotifyApi.getPlaylistTracks(playlistUri, options).then((data) => {
		  	var tracks = data.body.items//.map(i => i.track.artists[0].name + ' - ' + i.track.name.split(' - ')[0])
		  	if (data.body.next) {
		  		var numQueries = Math.ceil(data.body.total/options.limit)
		  		var queries = []
		  		for (var i=1; i<numQueries; i++) {
		  			queries.push(spotifyApi.getPlaylistTracks(playlistUri, 
	  					{ limit: 100, offset: 100*i }
  					))
	  			}
	  			resolve (Promise.all(queries).then(tks => {
	  				return tracks.concat(tks.map(t => t.body.items)
	  					.reduce((acc, curr) => acc.concat(curr)))
	  			}))
	  		} else {
	  			resolve(tracks.sort())
	  		}
		  }).catch(err => console.log(err))
  	}).then(tracks => {
  		return tracks.map(i => i.track.artists.map(a => a.name).join(', ') + ' - ' + i.track.name.split(' - ')[0]).sort()
  	})
		return Promise.all([googlePromise, spotifyPromise]).then(results => {
			var googleResults = results[0]
			var spotifyResults = results[1]
			// console.log(googleResults)
			// console.log(spotifyResults.slice(50))
			return(googleResults.filter(g => !spotifyResults.includes(g)))
		}).then(onePagesToAdd => {
			res.send(onePagesToAdd)

			return Promise.all(onePagesToAdd.map(p => spotifyAuth.searchTracks(p.replace(' - ', ' '))
				.then(rslt => {
					var matches = rslt.body.tracks.items.filter(t => t.name.indexOf(p.split(' - ')[1]) > -1)[0]
					return matches
				})
			))
		})
		.then(searchResults => { 
			spotifyAuth.addTracksToPlaylist(playlistUri, searchResults.filter(s => s !== undefined).map(s => s.uri))
			// console.log(searchResults)
		})
	}
})


router.get('/update/google/auth', function(req, res, next) {
	if (req.query.code){
		googleAuth = createGoogleConnection();
	  
	  googleAuth.getToken(req.query.code).then(data => {
	  	return data.tokens;
	  }).then(tokens => {
		  googleAuth.setCredentials(tokens);
			res.redirect('/spotify/update/onepage')
		})
	} else {
	  res.send("No code provided")
	}

})

router.get('/update/spotifyapi/auth', function(req, res, next) {
	if (req.query.code) {
		spotifyAuth = createSpotifyConnection();
	  
	  spotifyAuth.authorizationCodeGrant(req.query.code).then(data => {
	  	// console.log(data)
	  	return data.body;
	  }).then(tokens => {
	  	spotifyAuth.setAccessToken(tokens['access_token'])
	  	spotifyAuth.setRefreshToken(tokens['refresh_token'])
			res.redirect('/spotify/update/onepage')
		})
	} else {
	  res.send("No code provided")
	}
})


module.exports = router;
