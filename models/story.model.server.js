const mongoose = require('mongoose');
const storySchema = require('../schemas/story.schema.server');
const storyModel = mongoose.model('story_wiki',storySchema,'story_wiki');
module.exports = storyModel;
