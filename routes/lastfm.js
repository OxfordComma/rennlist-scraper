var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	// console.log((req.session.passport && req.session.passport.user.lastfm) ? 'yes' : 'no')
	if (req.session.passport && req.session.passport.user.lastfm) {
		res.render('music', { username: req.query.username })	
	}
	else {
		req.session.return = '/lastfm?username='+req.query.username
		res.redirect('/auth/lastfm')
	}	
})

module.exports = router;
