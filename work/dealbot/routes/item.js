const express = require('express');
const itemService = require('../services/item');

const router = express.Router();

router.get('/', (req, res) => {
    itemService.allItems().then((docs) => {
        res.send(docs);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.post('/add', (req, res) => {
    itemService.saveItem(req.body).then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.delete('/remove/:id', (req, res) => {
    itemService.deleteItem(req.params.id).then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

module.exports = router;