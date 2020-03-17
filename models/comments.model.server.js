const mongoose = require('mongoose');
const commentSchema = require('../schemas/comment.schema.server');
const commentModel = mongoose.model('storyComment',commentSchema,'storyComment');
module.exports = commentModel;
