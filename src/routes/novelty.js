const express = require('express');
const noveltyRouter = express.Router();
const noveltyController = require('../controllers/noveltyController');

noveltyRouter.get('/', noveltyController.retrieveNovelties);
noveltyRouter.get('/:id', noveltyController.getNoveltyById);
noveltyRouter.post('/', noveltyController.createNovelty);
noveltyRouter.patch('/:id', noveltyController.updateNovelty);
noveltyRouter.delete('/:id', noveltyController.deleteNovelty);
noveltyRouter.get('/employee/:employeeId', noveltyController.getNoveltiesByEmployee);
noveltyRouter.get('/period/:periodId', noveltyController.getNoveltiesByPeriod);

module.exports = noveltyRouter;