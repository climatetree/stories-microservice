const mongoose = require('mongoose');
const storySchema = require('../schemas/story.schema.server');
const storyModel = mongoose.model('story',storySchema,'story');
module.exports = storyModel;
