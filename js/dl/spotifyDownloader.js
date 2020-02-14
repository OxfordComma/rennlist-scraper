var SpotifyWebApi = require('spotify-web-api-node');

// SPOTIFY
	
let getSpotifyAuth = (req) => {
	var spotifyAuth = new SpotifyWebApi({
		clientId: process.env.spotify_client_id,
		clientSecret: process.env.spotify_client_secret
	})
	spotifyAuth.setAccessToken(req.accessToken)
	spotifyAuth.setRefreshToken(req.refreshToken)
	return spotifyAuth
}



let getSpotifyRecentData = (req) => {
	var options = { limit: 50 }

	var spotifyAuth = getSpotifyAuth(req.session.passport.user.spotify)
		
	return spotifyAuth.getMyRecentlyPlayedTracks(options).then(data => {
		console.log(data.body.items)
		return data.body.items.map(i => {
			return {
				date_played: new Date(i.played_at),
				artists: i.track.artists.map(a => a.name),
				album: i.track.album.name,
				name: i.track.name
			}
		})
	}).catch(err=>console.log(err))
}

let getSpotifyPlaylistData = (req, playlistUri) => {
	var items = []
	var options = { limit: 100, offset: 0 }
	var spotifyAuth = getSpotifyAuth(req.session.passport.user.spotify)

	let getNext = () => {
				return spotifyAuth.getPlaylistTracks(playlistUri, options)
		.then(data => {
				items.push.apply(items, data.body.items)

				options.offset = options.offset+100
				if (data.body.next)
					return getNext()
				else
					return items
			})
		}
		return getNext().then(data => {
				// console.log(data)

			return data.map(i => {
				return {
					date_added: new Date(i.added_at),
					artists: i.track.artists.map(a => a.name),
					album: i.track.album.name,
					name: i.track.name
				}
			})
		})
		.catch(err => console.log(err))

	// var playlistUri = req.query.playlistUri


	// return spotifyAuth.getPlaylistTracks(playlistUri, options)
}

let getSpotifySearchResults = (req, searchTerm) => {
	var spotifyAuth = getSpotifyAuth(req.session.passport.user.spotify)

	return spotifyAuth.searchTracks(searchTerm)
}


let addTracksToSpotifyPlaylist = (req, playlistUri, trackUris) => {
	var spotifyAuth = getSpotifyAuth(req.session.passport.user.spotify)
	console.log(playlistUri)
	console.log(trackUris)
	return spotifyAuth.addTracksToPlaylist(playlistUri, trackUris)
}

module.exports = {
	getSpotifyPlaylistData: getSpotifyPlaylistData,
	getSpotifySearchResults: getSpotifySearchResults,
	addTracksToSpotifyPlaylist: addTracksToSpotifyPlaylist
}