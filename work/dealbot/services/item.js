const itemModel = require('../models/item');
const notification = require('../services/notification');

let extractCurrencyFormat = (price) => {
    return price.substring(0, 1);
};

let extractNumericPrice = (price) => {
    //Removing unit
    price = price.substring(1, price.length);
    return parseInt(price.replace(/,/g, ''));
};

let allItems = () => {
    return new Promise((resolve, reject) => {
        itemModel.find({},
            { sort: { _id: -1 } },
            (err, docs) => {
                if (docs) {
                    resolve(docs);
                } else {
                    reject(err);
                }
            });
    });
};

let saveItem = (item) => {
    item.currencyFormat = extractCurrencyFormat(item.price);
    item.price = item.lowestPrice = extractNumericPrice(item.price);
    item.lowestPriceDate = new Date();
    item.priceLog = [];

    return new Promise((resolve, reject) => {
        allItems().then((docs) => {
            if (!docs.filter(doc => doc.name == item.name).length) {
                itemModel.insert(item, {}, (err, doc) => {
                    if (doc) {
                        resolve(doc);
                    } else {
                        reject(err);
                    }
                });
            } else {
                resolve({});
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

let logPrice = (item, currentPrice) => {
    currentPrice = extractNumericPrice(currentPrice) - (Math.floor(Math.random() * 10));

    let updateQuery = {
        $push: {
            priceLog: {
                price: currentPrice,
                date: new Date()
            }
        }
    };

    if (currentPrice < item.lowestPrice) {
        updateQuery = {
            ...updateQuery,
            $set: {
                lowestPrice: currentPrice
            }
        };
        //notification.sendEmail(item);
    } else if (currentPrice > item.lowestPrice) {
        updateQuery = {
            ...updateQuery,
            $set: {
                price: currentPrice,
                lowestPrice: currentPrice
            }
        };
    }

    return new Promise((resolve, reject) => {
        itemModel.findOneAndUpdate({ _id: item._id }, updateQuery, (err, doc) => {
            if (doc) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
};

let deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        itemModel.findOneAndDelete({ _id: id }, {}, (err, doc) => {
            if (doc) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
};

module.exports = {
    allItems,
    saveItem,
    logPrice,
    deleteItem
};