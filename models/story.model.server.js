const mongoose = require('mongoose');
const storySchema = require('../schemas/story.schema.server');
const storyModel = mongoose.model('story_collection',storySchema,'story_collection');
module.exports = storyModel;
