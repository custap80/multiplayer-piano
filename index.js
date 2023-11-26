const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var userOnline = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pianog.html');
});

app.use(express.static(__dirname + '/scripts'));

io.on('connection', (socket) => {
  // data : note on/off - kbd on/off - username/userid/color

  // Note On
  socket.on('note on', (pnote) => {
    socket.broadcast.emit('note on', pnote);
  });

  // Note Off
  socket.on('note off', (pnote) => {
    socket.broadcast.emit('note off', pnote);
  });

  // -----------------------------------------------------------------------
  // Keyboard On
  socket.on('kbd on', (keyId) => {
    socket.broadcast.emit('kbd on', keyId);
  });

  // Keyboard Off
  socket.on('kbd off', (keyId) => {
    socket.broadcast.emit('kbd off', keyId);
  });

  // -----------------------------------------------------------------------
  // Username add + check + update
  socket.on('checkuser', (username) => {
    userOnline[socket.id] = username;
    io.emit('checkuser', userOnline);
  });
  // Constantly updating user
  io.emit('whatuser', '');
  console.log('user '+socket.id+' : connected');

  // User disconnect
  socket.on('disconnect', () => {
    delete userOnline[socket.id];
    io.emit('checkuser', userOnline);
    console.log('user '+socket.id+' : disconnected');
  });
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});
