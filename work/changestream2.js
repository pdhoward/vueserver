
//using pipeline filter to focus on 1 field for changes

const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017/?replicaSet=rs0';
MongoClient.connect(uri, function(err, client) {

    const db = client.db('mydb');
    // Connect using MongoClient
    var filter = [{
        $match: {
            $and: [
                { "updateDescription.updatedFields.SomeFieldA": { $exists: true } },
                { operationType: "update" }]
        }
    }];

    var options = { fullDocument: 'updateLookup' };
    db.collection('somecollection').watch(filter, options).on('change', data => 
    {
        console.log(new Date(), data);
    });
});