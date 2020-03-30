const mongoose = require('mongoose');
const commentSchema = require('./comment.schema.server');

const storySchema = mongoose.Schema({
    story_id:String,
    user_id:Number,
    hyperlink:String,
    rating:Number,
    story_title:String,
    place_ids:[Number],
    media_type:String,
    date:Date,
    solution:[String],
    sector:[String],
    description:String,
    strategy:[String],
    comments:[commentSchema],
    liked_by_users: []
    },{
    toObject: {
        transform (doc, ret) {
            delete ret._id
        }
    },
    toJson:{
        transform (doc,ret) {
            delete ret._id
        }
    }
    });

module.exports = storySchema;
