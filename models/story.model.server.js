const mongoose = require('mongoose')
const storySchema = require('../schemas/story.schema.server')
const storyModel = mongoose.model('StoryModel', storySchema)
module.exports = storyModel
