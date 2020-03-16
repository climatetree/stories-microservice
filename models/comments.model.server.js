const mongoose = require('mongoose');
const commentSchema = require('../schemas/comment.schema.server');
const commentModel = mongoose.model('testComment',commentSchema,'testComment');
module.exports = commentModel;
