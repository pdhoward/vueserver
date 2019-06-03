require('./config/config');
require('./services/scheduler');

const https = require('https');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');

const flipkartRouter = require('./routes/flipkart');
const itemRouter = require('./routes/item');
const userRouter = require('./routes/user');

var app = express();

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));

app.use(cors());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

mongoose.connect(process.env.MONGODB_URL);
require('./models/user');
require('./config/passport');

app.use('/flipkart', flipkartRouter);
app.use('/item', itemRouter);
app.use('/user', userRouter);



const PORT = process.env.PORT;

console.log("Port: " + PORT);

app.listen(PORT, () => {
    console.log('HTTP Server started!');
});

// https.createServer({
//     key: fs.readFileSync('./config/ssl/server.key'),
//     cert: fs.readFileSync('./config/ssl/server.crt')
// }, app).listen(PORT, () => {
//     console.log('HTTPS Server started!');
// });