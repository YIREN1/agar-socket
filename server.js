const express = require('express');

const app = express();

const port = process.env.PORT || 3001;

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

const server = app.listen(port, listen);

const socket = require('socket.io');

const io = socket(server);

const clients = [];
const food = [];

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
  });

  socket.on('start', (data) => {
    // console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
    // socket.broadcast.emit('mouse', data);
    const client = new Client(socket.id, data.x, data.y, data.r);
    clients.push(client);
    //io.sockets.emit('mouse', data);
  });

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

  socket.on('die', (data) => {
    let i;
    for (i = 0; i < clients.length; i++) {
      if (data.id === clients[i].id) {
        break;
      }
    }
    clients.splice(i, 1);
  });

  socket.on('disconnect', function() {
    console.log("Client has disconnected");
    let i;
    for (i = 0; i < clients.length; i++) {
      if (socket.id == clients[i].id) {
        break;
      }
    }
    clients.splice(i, 1);
  });
});

app.use(express.static('public'));
console.log('server is running');
