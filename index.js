
//xxxxxxx

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


let connectionCount = 0;


function updateConnectionCount() {
  io.emit('connectionCount', connectionCount);
  console.log("Current connection count:", connectionCount); // Add this line
}
io.on('connection', (socket) => {
  console.log('A user connected');
  connectionCount++;
  updateConnectionCount();


  socket.on('join', (username) => {
    // Emit the message to all connected clients including the sender
    io.emit('join', username);
  });

  
  socket.on('message', (data) => {
    // Emit the message to all connected clients including the sender
    io.emit('message', data);
  });



  socket.on('disconnect', () => {
    console.log('A user disconnected');
    connectionCount--;
    updateConnectionCount();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
