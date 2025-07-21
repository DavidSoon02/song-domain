const express = require('express');
const { getAllSongs, getSongById } = require('../controllers/songController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/songs', authenticateToken, getAllSongs);
router.get('/songs/:id', authenticateToken, getSongById);

module.exports = router;
