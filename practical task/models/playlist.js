const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    collaborative: {
        required: true,
        type: Boolean
    },
    owner_id: {
        required: true,
        type: String
    },
    public: {
        required: true,
        type: Boolean
    },
})

module.exports = mongoose.model('Playlist', dataSchema)