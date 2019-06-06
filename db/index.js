require('dotenv').config()

/////////////////////////////////////////////////
////////////////// db connection ///////////////
///////////////////////////////////////////////

const mongoose =                require('mongoose')

const pipeline = [ { $project: { documentKey: false } } ];

let options = {
    useNewUrlParser: true
}

//mongoose.connect('mongodb://localhost/streamdatabase', options);
mongoose.connect(process.env.ATLAS_URI, options);

const db = mongoose.connection;

module.exports = db