const Song = require('../models/Song');

const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.json({
            message: 'Songs retrieved successfully',
            songs,
            count: songs.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve songs' });
    }
};

const getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        res.json({
            message: 'Song retrieved successfully',
            song
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve song' });
    }
};

module.exports = { getAllSongs, getSongById };
