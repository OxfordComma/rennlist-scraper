var express = require('express');
var axios = require('axios');
var $ = require('cheerio');
var router = express.Router();
var scraper = require('./scraper.js')

router.get('/porsche', function(req, res, next) {
	scraper.getMongoData(scraper.getMongoClient()).then(carList => {
		console.log(carList)
		res.render('997', cars=carList)
		res.end()
	})
});

// router.get('/porsche/data/upload/recent', function(req, res, next) {
// 	addMostRecent().then(carList => {
// 		res.json(carList)
// 	})
// })

// router.get('/porsche/data/upload/all', function(req, res, next) {
// 	updateAll().then(carList => {
// 		res.json(carList)
// 	}).catch(err => console.log(err))
// })

router.get('/porsche/data/download', function(req, res, next) {
	scraper.getMongoData(scraper.getMongoClient()).then(data => {
		res.json(data)
	}).catch(err => console.log(err))
});

module.exports = router;
