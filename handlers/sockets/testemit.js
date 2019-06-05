const moment =        require(`moment`)
const uuidv4 =        require('uuid/v4');
const message =       require(`../../models/message`)
const newsemit =      require(`../../db/data/newsemit.json`);
const imageDB =       require('../../db/data/images.json')
const {LoremIpsum} =  require('lorem-ipsum')

const expArr = ['info', 'danger', 'primary', 'success', 'warning' ]
const exp1 = [{ 'theme': 'info' }]
const chn1 = [ { 'channel': 'network1'}, { 'channel': 'network2'}, { 'channel': 'network3'} ]
  
const lorem = new LoremIpsum({
sentencesPerParagraph: { max: 8, min: 4 },
wordsPerSentence: { max: 10, min: 4 } });
  
let xid = 4
module.exports = (io, client, time) => {
  // assign a unique id to each client connecting  
  console.log((new Date()))
  console.log(`Detected New Connection: ${client.id}`)
  console.log(`Interval set to ${time}`) 
  xid = xid + 1      
  let messageArray = []  
  newsemit.data.id = xid
  // insert some random content
  newsemit.data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
  let imageObj = imageDB[Math.floor(Math.random()*imageDB.length)]
  newsemit.data.url = imageObj.photo
  let exp = expArr[Math.floor(Math.random()*expArr.length)];
  newsemit.data.content = lorem.generateSentences(5)
  newsemit.data.headline = lorem.generateWords(5)    
  exp1[0].theme = exp
  let messageObj = Object.assign({}, message.obj) 
  messageObj.MsgId = xid 
  messageObj.Content = []
  messageObj.Content.push(newsemit.data)    
  messageObj.OwnerId = uuidv4()
  messageObj.TemplateId = uuidv4()
  messageObj.Experiences = [...exp1]
  messageObj.Channels = [...chn1]
  messageArray.push(messageObj)
    
  const ADD = JSON.stringify({
    type: `ADD`,
    entity: messageArray,
  })
  io.sockets.emit('broadcast', ADD)
  //client.emit('message', ADD)
}
