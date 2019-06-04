
require('dotenv').config()
const {socketevents} =          require('./sockets')
const {dbevents} =              require('./db')
const { g, b, gr, r, y } =      require('../console');

////////////////////////////////////////////////////////////////
////////////////Register Events and Start Server //////////////
//////////////////////////////////////////////////////////////

const register = (io) => {    
  socketevents(io)  
  dbevents()
  // submit a no argument from cli to skip registering redis if poor internet service
  let argv = "yes"    
  if (process.argv[2]) argv = process.argv[2]  
  if (argv != 'no') {
    const {redisevents} =  require('./redis')
    redisevents()
  }

}

const events = (app) => {
  let server = require('http').Server(app);
  let io = require('socket.io')(server)
  register(io)  
  return {server, io}
}

module.exports = {
  events    
}