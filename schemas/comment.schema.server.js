const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment_id: String,
    story_id:String,
    user_id: Number,
    content: String,
    date: Date
},{
    toObject: {
        transform: function (doc, ret) {
            delete ret._id
        }
    },
    toJson: {
        transform: function (doc, ret) {
            delete ret._id
        }
    }
});

module.exports = commentSchema;
