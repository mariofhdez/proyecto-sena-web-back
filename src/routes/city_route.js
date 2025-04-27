const express = require ('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.post('/', cityController.create);
router.delete('/:id', cityController._delete);

module.exports = router;