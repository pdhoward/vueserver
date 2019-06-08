

module.exports = function(io, document){
  // assign a unique id to each client connecting  
  console.log((new Date()))    
  let messageArray = []

  console.log(document.fullDocument)
  
  messageArray.push(document.fullDocment)
  
  const ADD = JSON.stringify({
    type: `ADD`,
    entity: messageArray,
  })  
  io.sockets.emit('broadcast', ADD)  
}
