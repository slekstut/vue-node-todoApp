const Todo = require('../models/todo');
const { validationResult } = require('express-validator');

exports.getTodos = (req, res, next) => {
 Todo.find()
  .then(todos => {
   res.status(200).json({
    message: "Fetched todos successfully.",
    todos: todos
   });
  })
  .catch(err => {
   if (!err.statusCode) {
    err.statusCode = 500;
   }
   next(err);
  })
};

exports.createTodo = (req, res, next) => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
  const error = new Error('Validation failed, entered data is incorrect!');
  error.statusCode = 422;
  throw error;
 }
 const text = req.body.text;
 const completed = false;
 const todo = new Todo({
  text: text,
  completed: completed
 });
 todo.save()
 .then(result => {
  console.log(result);
  res.status(201).json({
   message: 'Todo was created.',
   todo: result
  });
 }).catch(err => {
  if(!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
 });
};

exports.updateTodo = (req, res, next) => {
  const todoId = req.params.todoId;
  const completed = req.body.completed;
  Todo.findById(todoId)
  .then(todo => {
   console.log(todo);
    if (!todo) {
      const error = new Error('Could not find todo.');
      error.statusCode = 404;
      throw error;
    }
    todo.completed = completed;
    return todo.save();
  })
  .then(result => {
    res.status(200).json({ message: 'Todo updated!', todo: result });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.deleteTodo = (req, res, next) => {
  const todoId = req.params.todoId;
  Todo.findById(todoId)
    .then(todo => {
      if (!todo) {
        const error = new Error('Could not found todo.');
        error.statusCode = 404;
        throw error;
      }
      return Todo.findByIdAndRemove(todoId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Deleted todo.'});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    })
}