const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname + '/test'));


io.on('connection', (socket) => {
  console.log('A user connected');

  const userId = socket.id;

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete players[userId];

  });
});
    

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
