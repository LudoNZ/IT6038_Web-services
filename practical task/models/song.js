const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String
    },
    title: {
        required: true,
        type: String
    },
    album: {
        required: true,
        type: String
    },
    artist: {
        required: true,
        type: String
    },
    year: {
        required: true,
        type: Number
    },
    track_number: {
        required: true,
        type: Number
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }
})

module.exports = mongoose.model('Song', dataSchema)