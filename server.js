const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname + '/public'));

var users = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  const userId = socket.id;

  socket.on("newPlayer", (data) => {
    /*player = data
    player.id = userId
    users.push(player);*/
    users.push(data);
    io.emit("newPlayer", data);
  });

  socket.on("joined", () => {
    socket.emit("joined", users);
  });

  // Create a unique user ID for the connected user

  // Add the user to the list of connected users
  /*users[userId] = {
    pk:{},
    x:0,
    y:0
  };*/

  // Execute the new user function
  //io.emit('newUser',users[userId])




  socket.on('updatePlayer', (data) => {
    let id = data.id;
    users[id].x = data.x;
    users[id].y = data.y;

    io.emit("updatePlayer", users)
  })

  socket.on('catchBall', (data) => {
    let id = data.id;
    users[id].score++
    io.emit("catchBall", data)
  })

  /*socket.on('updatePlayers', (players) => {
    users=players
  })*/

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete users[userId];

    // Notify all clients about the disconnected user
    io.emit('update', users);
  });
});
    

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
