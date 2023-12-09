const express = require('express');
const socket = require('socket.io');
const app = express();

const tasks = [];

const server = app.listen(8000, () => {
    console.log('Server is running on port 8000');
  });
  
const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    io.to(socket.id).emit('updateData', tasks);

    socket.on('addTask', () => {});
    socket.on('removeTask', () => {})
});  
  