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
      
      socket.broadcast.emit('addTask', newTask);
      //console.log(newTask, "newTask", tasks, "allTasks")
    });

    socket.on('removeTask', (id) => { 
      const removedTaskIndex = tasks.findIndex(task => task.id === id);
        if (removedTaskIndex !== -1) {
          tasks.splice(removedTask, 1);
          socket.broadcast.emit('removeTask', id);
        }
    });
  
});  
  