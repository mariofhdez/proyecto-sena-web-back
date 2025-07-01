const conceptService = require('../services/conceptService');

exports.getAllConcepts = async (req, res, next) => {
    try {
        const concepts = await conceptService.getAll();
        res.json(concepts);
    } catch (error) {
        next(error);
    }
}