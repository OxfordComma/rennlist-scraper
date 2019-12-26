var express = require('express');
var router = express.Router();
// var scraper = require('../js/scraper.js')
// var downloader = require('../js/downloader.js')
router.get('/', function(req, res, next) {
	res.redirect('/porsche')
})

router.get('/porsche', function(req, res, next) {
	// scraper.getMongoData(scraper.getMongoClient()).then(carList => {
		res.render('997')
		// res.end()
	// })
});

module.exports = router;
