import express from 'express'; // Express framework
import { createServer } from 'node:http'; // HTTP server
import { Server } from 'socket.io'; // Socket.io server
import 'dotenv/config'; // Load .env file

const app = express(); // Express app
const server = createServer(app); // HTTP server + Express
const io = new Server(server); // Socket.io attached to server
const port = process.env.PORT || 3000; // Port from env or 3000

// EJS Setup
app.set('view engine', 'ejs'); // Express ko bata diya ki EJS use karna hai
app.set('views', './views'); // views folder ka path (default './views')

app.use(express.static('public')); // **Static files serve karne ke liye public folder**

app.get('/', (req, res) => {
  res.render('index'); // Root route
});

io.on('connection', (socket) => {
  console.log('A user connected', socket.id); // Client connected
  socket.on('sendLocation', (data) => {
    io.emit('getLocation', { id: socket.id, ...data });
  });
  socket.on('disconnect', () => {
    console.log('User disconnected'); // Client disconnected
    io.emit('user-disconnected', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Start server
});
