const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname + '/rtc_test'));

var players = 0;

io.on('connection', (socket) => {
  console.log('A user connected');

  const userId = socket.id;

  socket.on("newPlayer", (data) => {
    console.log("newPlayer (server.js)")
    players++;
    io.emit("newPlayer", players);
  });

  socket.on("joined", () => {
    socket.emit("joined", "");
  });

  socket.on('peer-id', (peerId) => {
    socket.broadcast.emit('peer-id', peerId);
  });
  
  socket.on("movePiece", (data) => {
    io.emit("movePiece", data);
  })
  
  socket.on("selectPiece", (data) => {
    io.emit("selectPiece", data);
  })

  socket.on("updateBoard", (data) => {
    io.emit("updateBoard", data);
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
    players[id].x = data.x;
    players[id].y = data.y;

    io.emit("updatePlayer", players)
  })

  socket.on('catchBall', (data) => {
    let id = data.id;
    players[id].score++
    io.emit("catchBall", data)
  })

  /*socket.on('updatePlayers', (players) => {
    users=players
  })*/

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete players[userId];

    // Notify all clients about the disconnected user
    io.emit('update', players);
  });
});
    

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
