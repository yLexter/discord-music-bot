const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    id: {
        type: String,
        required: true
    },

    customPlaylist: Array
})

module.exports = mongoose.model('users', schema)
