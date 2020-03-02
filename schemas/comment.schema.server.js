const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    user_id: Number,
    content: String,
    date: Date
});

module.exports = commentSchema;
