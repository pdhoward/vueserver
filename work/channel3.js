
// using socket.handshake which interrogates a query
// server side
var server = require('http').createServer(),
    io     = require('socket.io')(server);


io.on('connection', function(socket){

  var room = socket.handshake['query']['r_var'];

  socket.join(room);
  console.log('user joined room #'+room);

  socket.on('disconnect', function() {
    socket.leave(room)
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    io.to(room).emit('chat message', msg);
  });

});

server.listen(3000);

// client side
var socket_connect = function (room) {
    return io('localhost:3000', {
        query: 'r_var='+room
    });
}

var random_room = Math.floor((Math.random() * 2) + 1);
var socket      = socket_connect(random_room);

socket.emit('chat message', 'hello room #'+random_room);
// ... more