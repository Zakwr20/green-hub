const multer = require('multer');
const config = require('../config/env');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (config.storage.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: config.storage.maxFileSize
  },
  fileFilter
});

module.exports = upload;

