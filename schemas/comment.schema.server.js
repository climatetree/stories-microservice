const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    comment_id: String,
    user_id: Number,
    content: String,
    date: Date
});

module.exports = commentSchema;
