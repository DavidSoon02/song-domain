const Song = require('../models/Song');

const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSong = await Song.findByIdAndDelete(id);

        if (!deletedSong) {
            return res.status(404).json({ error: 'Song not found' });
        }

        res.json({
            message: 'Song deleted successfully',
            song: deletedSong
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete song' });
    }
};

module.exports = { deleteSong };
