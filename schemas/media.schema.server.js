const mongoose = require('mongoose');

const mediaTypeSchema = mongoose.Schema({
    mediaType:String,
    });

module.exports = mediaTypeSchema;