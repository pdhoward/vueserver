const db = require('monk')(process.env.MONGODB_URL);

let trackedItems = db.get('TrackedItems');

module.exports = trackedItems;