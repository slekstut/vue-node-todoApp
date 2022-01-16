const express = require('express');
const { body } = require('express-validator');

const todoController = require('../controllers/todos');

const router = express.Router();

router.get('/list', todoController.getTodos);

router.post('/create-todo', [
 body('text').trim().isLength({ min: 5 })
], todoController.createTodo);

router.put('/:todoId', todoController.updateTodo);

router.delete('/:todoId', todoController.deleteTodo);

module.exports = router;