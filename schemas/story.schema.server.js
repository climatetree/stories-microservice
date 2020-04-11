const mongoose = require('mongoose');
const commentSchema = require('./comment.schema.server');

var storySchema = mongoose.Schema({
    story_id: {
        type: String,
        required: true
    },
    posted_by: {
        type: String,
        required: true
    },
    user_id: {
        type: Number,
        required: true
    },
    hyperlink: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        'default': 0
    },
    story_title: {
        type: String,
        required: true
    },
    place_ids: {
        type: [Number],
        required: true,
        validate: [(value) => value.length > 0, 'No place_id']
    },
    media_type: {
        type: String,
        required: true, 
        'default': "Other"},
    date: {type: Date},
    solution: {
        type: [String],
        required: true,
        'default': ["Other"]
    },
    sector: {
        type: [String],
        required: true,
        'default': ["Other"]
    },
    description: {type: String},
    strategy: {
        type: [String],
        required: true,
        'default': ["Other"]
    },
    comments: [{type: commentSchema}],
    liked_by_users: [{type: Number}],
    flagged_by_users: [{type: Number}]
}, {
    toObject: {
        transform(doc, ret) {
            delete ret._id
        }
    },
    toJson: {
        transform(doc, ret) {
            delete ret._id
        }
    }
});

module.exports = storySchema;
