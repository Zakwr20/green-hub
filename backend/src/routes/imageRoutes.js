const express = require('express');
const imageController = require('../controllers/imageController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { imageValidation } = require('../utils/validator');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(authenticate);

router.post(
  '/plants/:plantId',
  upload.array('images', 10),
  imageValidation.upload,
  validate,
  imageController.upload
);

router.get('/plants/:plantId', imageController.getByPlantId);

router.patch('/:id/primary', imageController.setPrimary);

router.patch('/plants/:plantId/reorder', imageController.reorder);

router.put('/:id', imageController.update);

router.delete('/:id', imageValidation.delete, validate, imageController.delete);

module.exports = router;

