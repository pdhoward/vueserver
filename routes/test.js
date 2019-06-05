'use strict';

/////////////////////////////////////////////
///// sets interval for stream testing  ////
///////////////////////////////////////////
const testemit = require('../handlers/sockets/testemit')

const { g, b, gr, r, y } =  require('../console')

var testinterval = null

const test = (router) => {  
  router.use(async(req, res, next) => { 
    
    console.log(g("----- Test Route------"))
    let time = 10000    
    let testParms = req.body    

    console.log(req.body)      
    
    clearInterval(testinterval)      

    switch(testParms.type) {
      case 'slow':
        time = 30000
        break
      case 'medium':
        time = 10000
        break
      case 'fast':
        time = 1000
    }  

    testinterval = setInterval(testemit, time, req.bag)   

    let sec = (time / 1000)
    console.log(`Start Broadcasting every ${sec} seconds`)    

    let data = {}
    data.success=true

    res.send(data)
    next()

  })  
}
module.exports = test
