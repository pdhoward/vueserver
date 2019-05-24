const express =       require(`express`);
const path =          require(`path`);
const webSocket =     require(`ws`);
const http =          require(`http`);
const message =       require(`./models/message`)
const news =          require(`./db/data/news.json`);
const newsupdate =   require(`./db/data/news-1-update.json`);
const newsadd =      require(`./db/data/news-3-add.json`);
const imageDB =       require('./db/data/images.json')
const {LoremIpsum} =  require('lorem-ipsum')

const PORT = 3100;

const app = express();

const expArr = ['info', 'danger', 'primary', 'success', 'warning' ]
const exp1 = [{
  'theme': 'info'  
}]
const chn1 = [
  { 'channel': 'network1'},
  { 'channel': 'network2'},
  { 'channel': 'network3'}
]

const server = http.createServer(app);

const wss = new webSocket.Server({
  path: `/ws`,
  server,
});

const ADD = JSON.stringify({
  type: `ADD`,
  entity: newsadd,
});
const UPDATE = JSON.stringify({
  type: `UPDATE`,
  entity: newsupdate,
});

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

wss.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
});

app.use(express.static(path.resolve(__dirname, `components`), {
  maxAge: `365d`,
}));
// NOTE only sending obj.data in message
app.get(`/news`, (req, res) => { 
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
});

let xid = 4

wss.on(`connection`, (ws) => {
  // assign a unique id to each client connecting
  ws.id = wss.getUniqueID();

  // NOTE only sending obj.data in message
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  // send updates for news3add
  setInterval(function() {
    xid = xid + 1     
    let messageArray = []  
    newsadd.data.id = xid
    // insert some random context
    newsadd.data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
    let imageObj = imageDB[Math.floor(Math.random()*imageDB.length)]
    newsadd.data.url = imageObj.photo
    var exp = expArr[Math.floor(Math.random()*expArr.length)];
    newsadd.data.content = lorem.generateSentences(5)
    newsadd.data.headline = lorem.generateWords(5)
    var exp = expArr[Math.floor(Math.random()*expArr.length)];
    exp1[0].theme = exp
    let messageObj = Object.assign({}, message.obj) 
    messageObj.MsgId = xid 
    messageObj.Content = []
    messageObj.Content.push(newsadd.data)    
    messageObj.OwnerId = wss.getUniqueID()
    messageObj.TemplateId = wss.getUniqueID()
    messageObj.Experiences = [...exp1]
    messageObj.Channels = [...chn1]
    messageArray.push(messageObj)
     
    const ADD = JSON.stringify({
      type: `ADD`,
      entity: messageArray,
    })

    wss.clients.forEach(function(ws) {
      if (ws.readyState === ws.OPEN) {
        console.log(`A message was sent Client ${ws.id} `)
        ws.send(ADD)      
      }
    })

  }, 10000)

})

  //setTimeout(() => setInterval(() => ws.send(UPDATE), 5000), 2500);


server.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Listening on: http://localhost:${PORT}`);
