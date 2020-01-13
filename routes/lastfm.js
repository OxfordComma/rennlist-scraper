var express = require('express');
var router = express.Router();


router.get('/musicstream', function(req, res, next) {
	res.render('music', { username: req.query.username, pages: req.query.pages })
})

router.get('/', function(req, res, next) {
	res.render('username')
})

module.exports = router;
