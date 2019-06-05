'use strict';

/////////////////////////////////////////////
///// sets interval for stream testing  ////
///////////////////////////////////////////
const moment =        require(`moment`)
const uuidv4 =        require('uuid/v4');
const message =       require(`../models/message`)
const staticnews =    require(`../db/data/news.json`);
const imageDB =       require('../db/data/images.json')
const {LoremIpsum} =  require('lorem-ipsum')

const { g, b, gr, r, y } =  require('../console')


const test = (router) => {  
  router.use(async(req, res, next) => {

    console.log(g("----- Test Route------"))        
    console.log(req.body)

  })  
}
module.exports = test
