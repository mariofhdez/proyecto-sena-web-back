const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees_controller');

router.get('/', employeesController.get);
router.get('/:id', employeesController.getById);
router.post('/', employeesController.create);
router.put('/:id', employeesController.update);
router.delete('/:id', employeesController._delete);

module.exports = router;