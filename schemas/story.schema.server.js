const mongoose = require('mongoose');
const commentSchema = require('./comment.schema.server');
const mongoosastic = require('mongoosastic');

var storySchema = mongoose.Schema({
story_id: {
  type: String,
  required: true,
  es_indexed:true
},
posted_by: {
  type: String,
  required: true,
  es_indexed: true
},
user_id: {
  type: Number,
  required: true,
  es_indexed: true
},
hyperlink: {
  type: String,
  required: true
},
rating: {
  type: Number,
  'default': 0,
  es_indexed: true
},
story_title: {
  type: String,
  required: true,
  es_indexed: true
},
place_ids: {
  type: [Number],
  required: true,
  validate: [(value) => value.length > 0, 'No place_id'],
  es_indexed: true
},
media_type: {type: String, 'default': "Other",es_indexed: true},
date: {type: Date,es_indexed:true},
solution: {
  type: [String],
  required: true,
  'default': ["Other"],
  es_indexed: true
},
sector: {
  type: [String],
  required: true,
  'default': ["Other"],
  es_indexed: true
},
description: {type: String,es_indexed: true},
strategy: {
  type: [String],
  required: true,
  'default': ["Other"],
  es_indexed: true
},
comments: [{type: commentSchema}],
liked_by_users: [{type: Number}],
flagged_by_users: {type:[{type: Number}],es_indexed:true}
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

const setHosts=()=>{
  let connObj={"hydrate": true,};
  if(process.env.DOCKER_ENABLE_CI){
    connObj.hosts=["https://climatetree-elasticsearch.azurewebsites.net/"]
  }
  return connObj;
};

storySchema.plugin(mongoosastic,setHosts());
module.exports = storySchema;
