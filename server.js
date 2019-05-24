const express =       require(`express`);
const path =          require(`path`);
const webSocket =     require(`ws`);
const http =          require(`http`);
const message =       require(`./models/message`)
const news =          require(`./db/data/news.json`);
const newsupdate =   require(`./db/data/news-1-update.json`);
const newsadd =      require(`./db/data/news-3-add.json`);

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

app.get(`/news`, (req, res) => { 
  let x = 0 
  let messageArray = []
  news.forEach((n) => {
    x = x + 1
    var exp = expArr[Math.floor(Math.random()*expArr.length)];
    exp1[0].theme = exp
    let messageObj = Object.assign({}, message.obj) 
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

  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  // send updates for news3add
  setInterval(function() {
    xid = xid + 1     
    let messageArray = []
    news3add.data.id = xid
    
    var exp = expArr[Math.floor(Math.random()*expArr.length)];
    exp1[0].theme = exp
    let messageObj = Object.assign({}, message.obj) 
    messageObj.Content = []    
    messageObj.Content.push(news3add)    
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
