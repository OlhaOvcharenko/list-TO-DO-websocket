const express = require('express');
const socket = require('socket.io');
const app = express();

const tasks = [];

const server = app.listen(8000, () => {
    console.log('Server is running on port 8000');
  });
  
const io = socket(server);

io.on('connection', (socket) => {
  
    io.to(socket.id).emit('updateTasks', tasks);

    socket.on('addTask', (newTask) => {
      tasks.push(newTask);
      
      socket.broadcast.emit('addTask', newTask);
    });

    socket.on('removeTask', (id) => {
      tasks.filter(task => task.id !== id)
      socket.broadcast.emit('removeTask', id);
    });
  
});  
  