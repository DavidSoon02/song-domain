const express = require('express');
const { addSong } = require('../controllers/songController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/songs', authenticateToken, addSong);

module.exports = router;
