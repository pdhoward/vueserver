const express =       require(`express`);
const path =          require(`path`);
const cors =          require('cors')

const PORT = 3100;
const app = express();


//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
});

app.use(express.static(path.resolve(__dirname, `components`), {
  maxAge: `365d`,
}));


//////////////////////////////////////////////////////////////////////////
////////////  Event Registration for server, streams and db      ////////
////////////////////////////////////////////////////////////////////////

const {server, io} = require('../events').events(app)

//  experiment with publish function - send msg to client
let argv = "yes"    
if (process.argv[2]) argv = process.argv[2]  
if (argv != 'no') {
  let sendMessage = require('../events/redis').publish
  sendMessage('monitor', JSON.stringify({'Body':'Machine is connected to Redis'}))
}
 //////////////////////////////////////////////////////
 ////////// Register and Config Routes ///////////////
 ////////////////////////////////////////////////////

const news =              express.Router()
const seed =              express.Router()
const test =              express.Router()
const expio =             express.Router()

require('../routes/news')(news)
require('../routes/seed')(seed)
require('../routes/test')(test)
require('../routes/expio')(expio)

app.use(function(req, res, next){
  req.bag = io 
  next()   
})

app.use(expio)

app.get(`/news`, news)
app.post(`/seed`, seed)
app.post(`/test`, test)

server.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Listening on: http://localhost:${PORT}`);
