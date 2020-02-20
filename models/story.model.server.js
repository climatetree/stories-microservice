const mongoose = require('mongoose');
const storySchema = require('../schemas/story.schema.server');
const storyModel = mongoose.model('test',storySchema,'test');
module.exports = storyModel;
