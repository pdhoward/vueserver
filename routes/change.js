'use strict';

/////////////////////////////////////////////
/////       change mongodb database     ////
///////////////////////////////////////////
const {LoremIpsum} =  require('lorem-ipsum')
const moment =        require(`moment`)
const uuidv4 =        require('uuid/v4');
const Message =       require('../models/messagedb')
const seeds =         require('../db/data/test.json')
const imageDB =       require('../db/data/images.json')

const { g, b, gr, r, y } =  require('../console')

const expArr = ['info', 'danger', 'primary', 'success', 'warning' ]
const exp1 = [{ 'theme': 'info' }]
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


const seed = (router) => {  
  router.use(async(req, res, next) => { 
    
    console.log(g("----- Seed Route------"))
    let time = 10000    
    let testParms = req.body       
    
      // use the Message model to insert/save
      Message.remove({}, () => {
        for (let n of seeds) {
            let x = 1
      // insert some random context
            n.data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
            let imageObj = imageDB[Math.floor(Math.random()*imageDB.length)]
            n.data.url = imageObj.photo
            var exp = expArr[Math.floor(Math.random()*expArr.length)];
            n.data.content = lorem.generateSentences(5)
            n.data.headline = lorem.generateWords(5)
            exp1[0].theme = exp
            let messageObj = {}           
            messageObj.Content = []
            messageObj.Experiences = []
            messageObj.Channels = []
            messageObj.Content.push(n)           
            messageObj.Experiences = [...exp1]
            messageObj.Channels = [...chn1]    

            var newMessage = new Message(messageObj);
            newMessage.save();
        }
      });    

    let data = {}
    data.success=true

    res.send(data)
    next()

  })  
}
module.exports = seed
