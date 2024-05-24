const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname + '/public'));

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Create a unique user ID for the connected user
  const userId = socket.id;

  // Add the user to the list of connected users
  users[userId] = {"keys":{}};
  io.emit('newUser',userId)

  // Broadcast user movements to all connected clients
  socket.on('keypress', (pressedKeys) => {
    users[userId]["keys"] = pressedKeys;

    // Send updated user positions to all clients
    io.emit('update', users);
  });
  socket.on('updatePlayers', (players) => {
    io.emit('update', users);
  })

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
