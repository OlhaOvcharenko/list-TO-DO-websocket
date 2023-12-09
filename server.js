const express = require('express');
const socket = require('socket.io');
const app = express();

const tasks = [];

const server = app.listen(8000, () => {
    console.log('Server is running on port 8000');
  });
  
const io = socket(server);

io.on('connection', (socket) => {
   
    io.to(socket.id).emit('updateData', tasks);

    socket.on('addTask', (newTask) => {
      tasks.push(newTask);
      
      const message = `New task has been published: ${newTask.task}`;
  
      socket.broadcast.emit('addTask', { id: socket.id,  task: message });
    });

    socket.on('removeTask', () => { 
    const removedTask = tasks.findIndex(task => task.id === socket.id);
      if (removedTask !== -1) {
        const taskName = tasks[removedTask].task; 
        tasks.splice(removedTask, 1);
        const message = `${taskName} has been deleted.`;
        socket.broadcast.emit('removeTask', { id: socket.id,  task: message});
      }
    });
  
});  
  