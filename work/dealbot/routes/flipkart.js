const express = require('express');
const flipkartService = require('../services/flipkart');

const router = express.Router();

router.get('/search/:keyword', (req, res) => {
    let searchUrl = 'https://www.flipkart.com/search?q=' + req.params.keyword;

    flipkartService.processSearchPage(searchUrl).then((searchResults) => {
        res.send(searchResults);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.get('/item', (req, res) => {
    let itemUrl = req.query.link;
    
    flipkartService.processItemPage(itemUrl).then((price) => {
        res.send(price);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

module.exports = router;