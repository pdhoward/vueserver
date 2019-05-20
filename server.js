const express =       require(`express`);
const path =          require(`path`);
const webSocket =     require(`ws`);
const http =          require(`http`);
const news =          require(`./data/news.json`);
const news1Update =   require(`./data/news-1-update.json`);
const news3add =      require(`./data/news-3-add.json`);

const PORT = 8200;

const app = express();

app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
});

app.use(express.static(path.resolve(__dirname, `components`), {
  maxAge: `365d`,
}));

app.get(`/news`, (req, res) => {
  res.send(news);
});

const server = http.createServer(app);

const wss = new webSocket.Server({
  path: `/ws`,
  server,
});

wss.getUniqueID = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

const ADD = JSON.stringify({
  type: `ADD`,
  entity: news3add,
});
const UPDATE = JSON.stringify({
  type: `UPDATE`,
  entity: news1Update,
});

let xid = 4

wss.on(`connection`, (ws) => {
  // assign a unique id to each client connecting
  ws.id = wss.getUniqueID();

  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })

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
})

  //setTimeout(() => setInterval(() => ws.send(UPDATE), 5000), 2500);


server.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Listening on: http://localhost:${PORT}`);
