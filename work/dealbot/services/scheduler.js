const schedule = require('node-schedule');

const itemService = require('../services/item');
const flipkartService = require('./flipkart');

var rule = new schedule.RecurrenceRule();
//rule.hour = 0;
rule.minute = 1;
//rule.second = 10;

var job = schedule.scheduleJob(rule, () => {
    itemService.allItems().then((docs) => {
        docs.forEach(doc => {
            flipkartService.processItemPage(doc.link).then((price) => {
                itemService.logPrice(doc, price).then((doc) => {
                    console.log('Price logged @ ' + (new Date()).toTimeString() + " // "+ doc.name + ' - ' + price);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });;
        });
    });
}); 

