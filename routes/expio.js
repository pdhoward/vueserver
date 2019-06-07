'use strict';
////////////////////////////////////////////////////
///// make socketio available across platform  ////
//////////////////////////////////////////////////
const { g, b, gr, r, y } =  require('../console')

const expio = (router) => {
    router.use(async(req, res) => {     
        console.log(g("----- Export IO------"))
        let socket
        if (req.io) {
            socket = req.io             
        } else {
            return socket
        }
        //next()
       
  })
  
}
module.exports = expio

