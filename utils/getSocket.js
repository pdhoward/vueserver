'use strict';
////////////////////////////////////////////////////
///// make socketio available across platform  ////
//////////////////////////////////////////////////

let socket = ''

module.exports = async (io) => {    
    socket = await store(io)
    return socket
}

const store = (io) => {    
    if (io) socket = io 
    return socket
}


