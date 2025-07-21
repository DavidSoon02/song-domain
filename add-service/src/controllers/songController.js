const Song = require('../models/Song');

const addSong = async (req, res) => {
    try {
        const { title, artist, duration, cover, preview, price } = req.body;

        if (!title || !artist || !duration || price === undefined) {
            return res.status(400).json({ error: 'Title, artist, duration and price are required' });
        }

        if (price < 0) {
            return res.status(400).json({ error: 'Price must be greater than or equal to 0' });
        }

        const song = new Song({
            title,
            artist,
            duration,
            cover,
            preview,
            price
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
