const express =       require(`express`);
const path =          require(`path`);
const webSocket =     require(`ws`);
const http =          require(`http`);
const message =       require(`./models/message`)
const news =          require(`./db/data/news.json`);
const news1Update =   require(`./db/data/news-1-update.json`);
const news3add =      require(`./db/data/news-3-add.json`);

const PORT = 3100;

const app = express();

const exp1 = [{
  'color': 'red',
  'border': 'bold'
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
  entity: news3add,
});
const UPDATE = JSON.stringify({
  type: `UPDATE`,
  entity: news1Update,
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
  console.log(`BUILDING NEXT STAGE`)
  //console.log(message.obj) 
  let x = 0 
  let messageArray = []
  news.forEach((n) => {
    x = x + 1   
    let messageObj = Object.assign({}, message.obj) 
    messageObj.Content = []    
    messageObj.Content.push(n.data)    
    messageObj.OwnerId = wss.getUniqueID()
    messageObj.TemplateId = wss.getUniqueID()
    messageObj.Experiences = [...exp1]
    messageObj.Channels = [...chn1]
    messageArray.push(messageObj)
  })
  console.log(JSON.stringify(messageArray, null, 2))

  res.send(news);
});

let xid = 4

wss.on(`connection`, (ws) => {
  // assign a unique id to each client connecting
  ws.id = wss.getUniqueID();

  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  /*
  setInterval(function() {
    xid = xid + 1
    news3add.data.id = xid
    const ADD = JSON.stringify({
      type: `ADD`,
      entity: news3add,
    })

    wss.clients.forEach(function(ws) {
      if (ws.readyState === ws.OPEN) {
        console.log(`A message was sent Client ${ws.id} `)
        ws.send(ADD)      
      }
    })

  }, 10000)
  */
})

  //setTimeout(() => setInterval(() => ws.send(UPDATE), 5000), 2500);


server.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Listening on: http://localhost:${PORT}`);
