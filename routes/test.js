'use strict';

/////////////////////////////////////////////
///// sets interval for stream testing  ////
///////////////////////////////////////////
const testemit = require('../handlers/sockets/testemit')

const { g, b, gr, r, y } =  require('../console')

const test = (router) => {  
  router.use(async(req, res, next) => { 
    
    console.log(g("----- Test Route------"))
    let time = 10000    
    let testParms = req.body

    console.log(req.body)
    if (testParms.type == 'fast') time = 5000
    if (testParms.type == 'medium') time = 10000
    if (testParms.type == 'slow') time = 30000

    let sec = (time / 1000)
    console.log(`Start Broadcasting every ${sec} seconds`)
    let testInterval
    clearInterval(testInterval)
    testInterval = setInterval(testemit(req.bag), time )

    let data = {}
    data.success=true

    res.send(data)
    next()

  })  
}
module.exports = test
