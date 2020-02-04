const mongoose = require('mongoose')
const commentSchema = require('./comment.schema.server')

const storySchema = mongoose.Schema({
    story_id: Number,
    user_id: Number,
    hyperlink: String,
    rating: Number,
    story_title: String,
    place_ids: [Number],
    media_type: String,
    date: Date,
    solution: [String],
    sector: String,
    comments: [commentSchema]
}, {collection: 'story_collection'})

module.exports = storySchema
