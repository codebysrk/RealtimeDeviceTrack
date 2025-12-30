import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import 'dotenv/config';

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  socket.on('sendLocation', (data) => {
    if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
      io.emit('getLocation', { id: socket.id, ...data });
    } else {
      console.error('Invalid location data received from:', socket.id);
    }
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
    io.emit('user-disconnected', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
