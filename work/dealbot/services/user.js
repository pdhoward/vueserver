const userModel = require('../models/user');

let findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        userModel.find({email}, (err, doc) => {
            if(doc) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
};

let findById = (id) => {
    return new Promise((resolve, reject) => {
        userModel.find({_id : id}, (err, doc) => {
            if(doc) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
};

let save = (item) => {
    return new Promise((resolve, reject) => {
        userModel.insert(item, {}, (err, doc) => {
            if (doc) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
};

module.exports = {
    findByEmail,
    save
};