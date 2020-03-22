var googleapis = require('googleapis')
const google = googleapis.google


// GOOGLE
let getGoogleAuth = () => {
	var googleAuth = google.drive({ 
		version: 'v3', auth: process.env.google_api_key
	})
	return googleAuth
}

let getOnePageData = () => {
	var options = {
		q: "'0B7wQpwvNx4sTUVZKMFFIVFByakE' in parents",
		orderBy: 'modifiedTime desc',
		pageSize: 1000,
		fields: 'files(id, name, starred)'
	}

	var googleAuth = getGoogleAuth()		

	return new Promise((resolve, reject) => {
		googleAuth.files.list(options, (err, result) => {
			if (err) console.log(err)
			var files = result.data.files.sort()

			resolve(files)
		})
	})
}

let getStarredOnePageData = () => {
	var options = {
		q: "'0B7wQpwvNx4sTUVZKMFFIVFByakE' in parents",
		orderBy: 'modifiedTime desc',
		pageSize: 1000,
		fields: 'files(id, name, starred)'
	}

	var googleAuth = getGoogleAuth()		

	return new Promise((resolve, reject) => {
		googleAuth.files.list(options, (err, result) => {
			if (err) console.log(err)
			var files = result.data.files
			console.log(files)//.filter(f => f.starred == true))
			resolve(files.filter(f => f.starred == true).sort())
		})
	})
}

module.exports = {
	getOnePageData: getOnePageData,
	getStarredOnePageData: getStarredOnePageData
}