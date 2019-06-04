'use strict';

///////////////////////////////
///// return static page  ////
/////////////////////////////
const moment =        require(`moment`)
const uuidv4 =        require('uuid/v4');
const message =       require(`../models/message`)
const staticnews =    require(`../db/data/news.json`);
const imageDB =       require('../db/data/images.json')
const {LoremIpsum} =  require('lorem-ipsum')

const { g, b, gr, r, y } =  require('../console')

const expArr = ['info', 'danger', 'primary', 'success', 'warning' ]
const exp1 = [{
  'theme': 'info'  
}]
const chn1 = [
  { 'channel': 'network1'},
  { 'channel': 'network2'},
  { 'channel': 'network3'}
]

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
    staticnews.forEach((n) => {
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
      messageObj.OwnerId = uuidv4()
      messageObj.TemplateId = uuidv4()
      messageObj.Experiences = [...exp1]
      messageObj.Channels = [...chn1]
      messageArray.push(messageObj)
   })
   res.send(messageArray);        
   next()

  })  
}
module.exports = news
