'use strict';

///////////////////////////////
///// return static page  ////
/////////////////////////////
const moment =        require(`moment`)
const message =       require(`../models/message`)
const news =          require(`../db/data/news.json`);
const imageDB =       require('../db/data/images.json')
const {LoremIpsum} =  require('lorem-ipsum')

const { g, b, gr, r, y } =  require('../console')


const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 10,
    min: 4
  }
});

const news = (router) => {  
  router.use(async(req, res, next) => {

    console.log(g("----- Static News------"))        
    let x = 0 
    let messageArray = []
    news.forEach((n) => {
      x = x + 1
      // insert some random context
      n.data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
      let imageObj = imageDB[Math.floor(Math.random()*imageDB.length)]
      n.data.url = imageObj.photo
      var exp = expArr[Math.floor(Math.random()*expArr.length)];
      n.data.content = lorem.generateSentences(5)
      n.data.headline = lorem.generateWords(5)
      exp1[0].theme = exp
      let messageObj = Object.assign({}, message.obj)
      messageObj.MsgId = x 
      messageObj.Content = []    
      messageObj.Content.push(n.data)    
      messageObj.OwnerId = wss.getUniqueID()
      messageObj.TemplateId = wss.getUniqueID()
      messageObj.Experiences = [...exp1]
      messageObj.Channels = [...chn1]
      messageArray.push(messageObj)
   })
   res.send(messageArray);        
   next()

  })  
}
module.exports = news
