/**
 * This file is used for connecting MongoDB and query data.
 */

// Set up mongoose connection
const mongoose = require('mongoose'),Admin=mongoose.mongo.Admin;
let database='climateTree';
let dev_db_url = 'mongodb://localhost:27017/'.concat(database);
let mongoDB = process.env.MONGODB_URI || dev_db_url;
let Schema=mongoose.Schema;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
allDatabases=null;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open',function () {
    new Admin(db.db).listDatabases(function(err, result) {
        console.log('listDatabases succeeded');
        // database list stored in result.databases
        allDatabases = result.databases;
    });
});

//Return all databases
exports.testDB=function(){
    return allDatabases;
};

let storySchema=new Schema({
    story_id:Number,
    user_id:Number,
    hyperlink:String,
    rating:Number,
    story_title:String,
    place_ids:[Number],
    media_type:String,
    date:Date,
    solutions:[{solution:String}],
    sector:String,
    comments:[{comment_id:Number,user_id:Number,content:String,date:Date}]
},{
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    },
    toJson:{
        transform:function (doc,ret) {
            delete ret._id;
        }
    }
});

story=mongoose.model('story_collection',storySchema,'story_collection');

exports.getStoryByPlaceID=function(placeID){
    return story.find({place_ids:{$all:[placeID]}});
};