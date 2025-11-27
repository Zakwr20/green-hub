const express = require('express');
const authRoutes = require('./authRoutes');
const plantRoutes = require('./plantRoutes');
const imageRoutes = require('./imageRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/plants', plantRoutes);
router.use('/images', imageRoutes);

module.exports = router;

