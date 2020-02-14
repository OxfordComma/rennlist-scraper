var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.redirect('/cars/porsche')
})

router.get('/porsche', function(req, res, next) {
	res.render('porsches')
});

module.exports = router;
