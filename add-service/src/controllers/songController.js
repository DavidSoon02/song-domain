const Song = require('../models/Song');

const addSong = async (req, res) => {
    try {
        const { title, artist, duration, cover, preview } = req.body;

        if (!title || !artist || !duration) {
            return res.status(400).json({ error: 'Title, artist and duration are required' });
        }

        const song = new Song({
            title,
            artist,
            duration,
            cover,
            preview
        });

        const savedSong = await song.save();
        res.status(201).json({
            message: 'Song added successfully',
            song: savedSong
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add song' });
    }
};

module.exports = { addSong };
