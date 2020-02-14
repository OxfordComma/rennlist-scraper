const express = require('express')
const router = express.Router()
// const passport = require('passport')
// const path = require('path')

const {google} = require('googleapis');
const scraper = require('../js/scraper.js')
const parseTab = require('../js/parseTab.js')


router.get('/', (req, res) => {
		res.render('import')
});

router.get('/tab', (req, res) => {
	if (req.session.passport && req.session.passport.user.google) {
		req.session.return = ''

		const oauth2Client = new google.auth.OAuth2();
		oauth2Client.setCredentials({
				'access_token': req.session.passport.user.google.accessToken,
				'refresh_token': req.session.passport.user.google.refreshToken
		});
		console.log(oauth2Client)
		const docs = google.docs({version: 'v1', auth: oauth2Client});
		const drive = google.drive({version: 'v3', auth: oauth2Client});

		// drive.files.list().then(data => console.log(data.data.files))
	  var tab, artist, song_name, raw_tabs, copyId;
	  scraper.getSong(req.session.tabUrl).then((tab) => {
	    artist = tab.artist;
	    song_name = tab.song_name;
	    raw_tabs = parseTab.formatRawTabs(tab.raw_tabs);
	    console.log('Importing: ' + song_name + ' by ' + artist);

	    var copyId;
	    drive.files.copy({
	        'fileId': '1K7dvZpTODZcfwxcLEsFJVCJhxaaO0_HfZBUn5rKcE3M',
	        'resource': { 'name': '[DRAFT] ' + artist + ' - ' + song_name}
	    }, (err, response) => {
	        if (err) {
	        	console.log(err)
            return console.log('The API returned an error while copying the template: ' + err);
	        }
	        copyId = response.data.id;
	        console.log('Copy id: ' + copyId)
	        docs.documents.get({
	            'documentId': copyId,
	        }, (err, response) => {
	            if (err) return console.log('The API returned an error while getting the document: ' + err);
	            const requests = [{
	                    'replaceAllText': { 
	                        'replaceText' : artist,
	                        'containsText': {
	                            'text' : '_Artist_',
	                            'matchCase' : true
	                        }
	                    }
	                },{
	                    'replaceAllText': { 
	                        'replaceText' : song_name,
	                        'containsText': {
	                            'text' : '_Song_',
	                            'matchCase' : true
	                        }
	                    } 
	                }, {                    
	                    'replaceAllText': { 
	                        'replaceText' : raw_tabs,
	                        'containsText': {
	                            'text' : '_Content_',
	                            'matchCase' : true
	                        }
	                    }
	                }]
	            docs.documents.batchUpdate({
	                'documentId': copyId,
	                'resource' : { 
	                    'requests': requests 
	                }
	            }, (err, response) => {
	                if (err) return console.log('The API returned an error while updating the document: ' + err);
	                res.redirect('https://docs.google.com/document/d/' + copyId);

	            })
	        });
	    })
		})
	}
	else {
		req.session.return = '/import/tab'
		req.session.tabUrl = req.query.url
		res.redirect('/auth/googledrive')
	}
})

module.exports = router;
