const noveltyService = require('../services/noveltyService');
const { validateNovelty } = require('../utils/noveltyValidation');

async function createNovelty(req, res, next) {
  try {
    const data = req.body;
    validateNovelty(data);
    const novelty = await noveltyService.createNovelty(data);
    res.status(201).json(novelty);
  } catch (err) {
    next(err);
  }
}

async function getNovelties(req, res, next) {
  try {
    const filter = req.query || {};
    const novelties = await noveltyService.getNovelties(filter);
    res.json(novelties);
  } catch (err) {
    next(err);
  }
}

async function getNoveltyById(req, res, next) {
  try {
    const { id } = req.params;
    const novelty = await noveltyService.getNoveltyById(id);
    if (!novelty) return res.status(404).json({ message: 'Novelty not found' });
    res.json(novelty);
  } catch (err) {
    next(err);
  }
}

async function updateNovelty(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    validateNovelty(data, true);
    const novelty = await noveltyService.updateNovelty(id, data);
    res.json(novelty);
  } catch (err) {
    next(err);
  }
}

async function deleteNovelty(req, res, next) {
  try {
    const { id } = req.params;
    await noveltyService.deleteNovelty(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNovelty,
  getNovelties,
  getNoveltyById,
  updateNovelty,
  deleteNovelty,
}; 