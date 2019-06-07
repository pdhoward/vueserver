require('dotenv').config()
const mongoose =                require('mongoose')
const { g, b, gr, r, y } =      require('../console');

const pipeline = [ { $project: { documentKey: false } } ];

let options = {
    useNewUrlParser: true
}

/////////////////////////////////////////////////////
/////////////////////database events ////////////////
//////////////////////////////////////////////////// 

exports.dbevents = async () => {    

    const db = mongoose.connection;
    const collection = db.collection('messages');

    db.on('error', console.error.bind(console, 'Connection Error:'))

    db.on('open', () => { 
      console.log(g(`db connection is a success`))
    })

    await mongoose.connect(process.env.ATLAS_URI, options);
    //await mongoose.connect('mongodb://localhost/streamdatabase', options);

    console.log(g(`DB events registered`))

    changeStream = collection.watch()
    // watch collections
    changeStream.on('change', next => {
      console.log(`Detected change in the mongodb`)
      console.log(JSON.stringify(next))
    })
}






