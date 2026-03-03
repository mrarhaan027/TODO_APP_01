const express = require('express');
const router = express.Router();
const taskController = require('./controllers');

router.get('/tasks', taskController.getTasks);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.delete('/tasks/clear/completed', taskController.clearCompleted);

module.exports = router;