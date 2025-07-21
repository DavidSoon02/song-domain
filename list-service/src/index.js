require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const songRoutes = require('./routes/songs');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use('/api', songRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    retryWrites: true,
})
    .then(() => {
        console.log('Connected to MongoDB successfully');
        console.log('Database URI:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        console.error('Connection URI (masked):', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    });

app.listen(PORT, () => {
    console.log(`List service running on port ${PORT}`);
});
