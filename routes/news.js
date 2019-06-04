'use strict';

///////////////////////////////
///// return static page  ////
/////////////////////////////


const { g, b, gr, r, y } =  require('../console')

const news = (router) => {
  
router.use('/api', async(req, res, next) => {

  console.log(g("----- FAST SEARCH------"))        
  console.log(`http detected `)          
  next()

  })  
}
module.exports = news
