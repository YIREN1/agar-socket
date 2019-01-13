const express = require('express');

const app = express();

const port = process.env.PORT || 3001;

const server = app.listen(port);

const socket = require('socket.io');

const io = socket(server);

const clients = [];

class Client {
  constructor(id, x, y, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

setInterval(() => {
  io.sockets.emit('heartbeat', clients);
}, 33);

io.sockets.on('connection', (socket) => {
  console.log('Notice! New one!' + socket.id);
  socket.on('mouse', (data) => {
    // console.log(data);
    socket.broadcast.emit('mouse', data);
    //io.sockets.emit('mouse', data);
  })
  socket.on('start', (data) => {
    // console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
    // socket.broadcast.emit('mouse', data);
    const client = new Client(socket.id, data.x, data.y, data.r);
    clients.push(client);
    //io.sockets.emit('mouse', data);
  })
  socket.on('update',
    function (data) {
      // console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
      let client;
      for (let i = 0; i < clients.length; i++) {
        if (socket.id == clients[i].id) {
          client = clients[i];
        }
      }
      client.x = data.x;
      client.y = data.y;
      client.r = data.r;
    }
  );
});

app.use(express.static('public'));
console.log('server is running');
