const express = require('express');
const { deleteSong } = require('../controllers/songController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.delete('/songs/:id', authenticateToken, deleteSong);

module.exports = router;
