const express = require('express');
const plantController = require('../controllers/plantController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { plantValidation } = require('../utils/validator');

const router = express.Router();

router.use(authenticate);

router.get('/', plantValidation.list, validate, plantController.getAll);

router.get('/statistics', plantController.getStatistics);

router.get('/:id', plantValidation.getById, validate, plantController.getById);

router.post('/', plantValidation.create, validate, plantController.create);

router.put('/:id', plantValidation.update, validate, plantController.update);

router.delete('/:id', plantValidation.getById, validate, plantController.delete);

module.exports = router;

