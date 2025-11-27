const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Email tidak valid')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password minimal 6 karakter'),
    body('full_name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Nama lengkap minimal 2 karakter'),
    validate
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Email tidak valid')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password harus diisi'),
    validate
  ],
  authController.login
);

router.post('/logout', authenticate, authController.logout);

router.get('/profile', authenticate, authController.getProfile);

router.put(
  '/profile',
  [
    authenticate,
    body('full_name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Nama lengkap minimal 2 karakter'),
    validate
  ],
  authController.updateProfile
);

router.put(
  '/change-password',
  [
    authenticate,
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password minimal 6 karakter'),
    validate
  ],
  authController.changePassword
);

router.post(
  '/forgot-password',
  [
    body('email')
      .isEmail()
      .withMessage('Email tidak valid')
      .normalizeEmail(),
    validate
  ],
  authController.forgotPassword
);

module.exports = router;

