/**
 * @fileoverview Rutas para la gestión de conceptos de nómina
 * @module routes/concept
 * @requires express
 * @requires ../controllers/conceptController
 */

const express = require('express');
const conceptRouter = express.Router();
const conceptController = require('../controllers/conceptController');

/**
 * GET /api/concept
 * Obtiene todos los conceptos de nómina del sistema
 * @route GET /
 * @returns {Object} Lista de conceptos de nómina
 */
conceptRouter.get('/', conceptController.getAllConcepts);

module.exports = conceptRouter;