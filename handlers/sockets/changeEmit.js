

module.exports = function(io, document){
  // assign a unique id to each client connecting  
  console.log((new Date()))    
  let messageArray = []  
  
  messageArray.push(document)
  
  const ADD = JSON.stringify({
    type: `ADD`,
    entity: messageArray,
  })
  io.sockets.emit('broadcast', ADD)  
}
