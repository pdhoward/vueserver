const express = require('express');
var secure = require('express-force-https');
const port = process.env.PORT || 8080;
const app = express();

app.use(secure);
app.use(express.static(__dirname + "/dist/"));
app.get(/.*/, (req, res) => {
  res.sendfile(__dirname + "/dist/index.html");
});
app.listen(port);

console.log("Server started...");
