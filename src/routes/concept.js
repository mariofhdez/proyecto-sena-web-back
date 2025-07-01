const express = require('express');
const conceptRouter = express.Router();
const conceptController = require('../controllers/conceptController');

conceptRouter.get('/', conceptController.getAllConcepts);

module.exports = conceptRouter;