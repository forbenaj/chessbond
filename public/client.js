const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set up socket.io client
const socket = io();

// Handle user input and send it to the server
canvas.addEventListener('mousemove', (event) => {
  // Send the user's cursor position to the server
  socket.emit('mousemove', {
    x: event.clientX,
    y: event.clientY,
  });
});

// Listen for updates from the server
socket.on('update', (data) => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw other users' cursors
  for (const id in data) {
    const user = data[id];
    ctx.fillRect(user.x, user.y, 10, 10); // Example: Draw a rectangle for each user
  }
});
