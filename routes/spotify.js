var express = require('express');
// var axios = require('axios');
// var $ = require('cheerio');
var router = express.Router();

// router.get('/update/onepage', function(req, res, next) {
// 	// var playlistUri = creds['spotify']['playlist_uri']
// 	var playlistUri = process.env.playlist_url

// 	if (!googleAuth) {
// 		res.redirect(urlGoogle())
// 	}
// 	else if (!spotifyAuth) {
// 		res.redirect(urlSpotify())
// 	}
// 	else if (spotifyAuth && googleAuth) {
// 		const drive = getGoogleDriveApi(googleAuth);
// 		const googlePromise = new Promise((resolve, reject) => {
// 			drive.files.list({
// 				q: "'0B7wQpwvNx4sTUVZKMFFIVFByakE' in parents",
// 				orderBy: 'modifiedTime desc',
// 				pageSize: 1000
// 			}, (err, result) => {
// 				var files = result.data.files
// 				console.log(files.length)
// 				var onePages = 
// 				files
// 					.map(f => f.name.replace('[DRAFT] ',''))
// 					.filter(n => !n.match(/\[(HOLIDAY|TEMPLATE|'Copy')\]/g))

// 				resolve(onePages.sort())
// 			})
// 		})

// 		const spotifyPromise = new Promise((resolve, reject) => {
// 			// var spotifyApi = spotifyAuth
// 			var options = { limit: 100, offset: 0 }
// 			spotifyAuth.getPlaylistTracks(playlistUri, options).then((data) => {
// 				var tracks = data.body.items//.map(i => i.track.artists[0].name + ' - ' + i.track.name.split(' - ')[0])
// 				if (data.body.next) {
// 					var numQueries = Math.ceil(data.body.total/options.limit)
// 					var queries = []
// 					for (var i=1; i<numQueries; i++) {
// 						queries.push(spotifyAuth.getPlaylistTracks(playlistUri, 
// 							{ limit: 100, offset: 100*i }
// 						))
// 					}
// 					resolve (Promise.all(queries).then(tks => {
// 						return tracks.concat(tks.map(t => t.body.items)
// 							.reduce((acc, curr) => acc.concat(curr)))
// 					}))
// 				} else {
// 					resolve(tracks.sort())
// 				}
// 			}).catch(err => console.log(err))
// 		}).then(tracks => {
// 			return tracks.map(i => i.track.artists.map(a => a.name).join(', ') + ' - ' + i.track.name.split(' - ')[0]).sort()
// 		})
// 		return Promise.all([googlePromise, spotifyPromise]).then(results => {
// 			var googleResults = results[0]
// 			var spotifyResults = results[1]
// 			// console.log(googleResults)
// 			// console.log(spotifyResults.slice(50))
// 			return(googleResults.filter(g => !spotifyResults.includes(g)))
// 		}).then(onePagesToAdd => {
// 			res.send(onePagesToAdd)

// 			return Promise.all(onePagesToAdd.map(p => spotifyAuth.searchTracks(p.replace(' - ', ' '))
// 				.then(rslt => {
// 					var matches = rslt.body.tracks.items.filter(t => t.name.indexOf(p.split(' - ')[1]) > -1)[0]
// 					return matches
// 				})
// 			))
// 		})
// 		.then(searchResults => { 
// 			spotifyAuth.addTracksToPlaylist(playlistUri, searchResults.filter(s => s !== undefined).map(s => s.uri))
// 			// console.log(searchResults)
// 		})
// 	}
// })





module.exports = router;
