import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
 

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('updateTasks', allTasks => updateTasks(allTasks));
    socket.on('addTask', newTask => addTask(newTask));
    socket.on('removeTask', id => removeTask(id));

    return () => {
      socket.disconnect();
    };
  }, []);

  const removeTask = (id, emitEvent = false) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  
    if (emitEvent) {
      socket.emit('removeTask', id);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const newTask = { name: taskName, id: shortid.generate() };
    addTask(newTask);
    socket.emit('addTask', newTask); 
    setTaskName('');
  };

  const addTask = (newTask) => {
    setTasks(tasks => [...tasks, newTask]);
    console.log(newTask, 'newTask')
  };

  const updateTasks = (allTasks) => {
    setTasks(allTasks);
  }

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => (
            <li key={task.id} className="task">
              {task.name}
              <button className="btn btn--red" onClick={() => removeTask(task.id, true)}>Remove</button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="btn" type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}

export default App;