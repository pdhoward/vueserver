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
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  const pulse = setInterval(() => {
    xid = xid + 1
    news3add.data.id = xid
    const ADD = JSON.stringify({
      type: `ADD`,
      entity: news3add,
    })

    wss.clients.forEach(function each(ws) {
      if (ws.readyState === ws.OPEN) {
        console.log(`Client is Open based on ${ws.readyState} `)
        ws.send(ADD)
      } else {
        console.log(`Client is Closed based on ${ws.readyState}`)
      }
    })

    }, 20000)

  })

  //setTimeout(() => setInterval(() => ws.send(UPDATE), 5000), 2500);


server.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Listening on: http://localhost:${PORT}`);
