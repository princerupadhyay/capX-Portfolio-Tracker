const Todo = require('./models/todo.js');
const User = require('./models/user.js');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/revisor')
.then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err);
});

// Adding todo to a user
const addTodoToUser = async (userId, task) => {
    try{
        const newTodo = new Todo({task});
        const savedTodo = await newTodo.save();

        const user = await User.findById(userId);
        user.todos.push(savedTodo._id); // pushing the reference id's of the todo in the todos array of user
        await user.save();

        console.log('Todo added to user');
    }
    catch(error){
        console.log(error);
    }
}

// Getting todo list of a user
const getUserWithTodos = async (userId) => {
    try {
        const user = await User.findById(userId).populate('todos').exec();
        console.log(user.todos);
    }
    catch(error){
        console.log(error);
    }
}

// addTodoToUser('66c218a4f7e69a721de652c0','Bath');
getUserWithTodos('66c218a4f7e69a721de652c0');