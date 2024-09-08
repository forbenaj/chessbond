// public/app.js
const socket = io();
const peer = new Peer();

peer.on('open', (id) => {
  document.getElementById('peer-id').textContent = `Your peer ID: ${id}`;
  socket.emit('peer-id', id);
});

socket.on('peer-id', (peerId) => {
  connectToPeer(peerId);
});

peer.on('connection', (conn) => {
  conn.on('data', (data) => {
    displayMessage(data);
  });
});

function connectToPeer(peerId) {
  const conn = peer.connect(peerId);
  conn.on('open', () => {
    conn.on('data', (data) => {
      displayMessage(data);
    });
  });
}

function sendMessage() {
  const message = document.getElementById('message').value;
  document.getElementById('message').value = ''; // Clear the input
  displayMessage(message); // Display your own message
  
  // Iterate over the peer.connections object
  Object.keys(peer.connections).forEach(peerId => {
    const conns = peer.connections[peerId]; // This is an array of connections to the peer
    conns.forEach(conn => {
      if (conn.open) { // Check if the connection is open
        conn.send(message); // Send the message to each connected peer
      }
    });
  });
}

function displayMessage(message) {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messagesDiv.appendChild(messageElement);
}
