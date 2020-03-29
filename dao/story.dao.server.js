const storyModel = require('../models/story.model.server');
const ObjectID = require("bson-objectid");

findAllStories = (limit, page) => storyModel.find().skip((page-1)*limit).limit(limit);

findTopStories = (numberOfStories) => storyModel.find().sort({date: 'desc'}).limit(parseInt(numberOfStories));

findStoryByStoryID = storyID => storyModel.findOne({story_id: storyID});

findStoryByPlaceID = (placeID, limit, page) => storyModel.find({place_ids:{$elemMatch:{$eq:placeID}}}).skip((page-1)*limit).limit(limit);

findStoryByTitle = (title, limit, page) => storyModel.find({story_title:{$regex: title,$options:'i'}}).skip((page-1)*limit).limit(limit);

findStoryByDescription=(desc,limit,page)=>storyModel.find( {description:{$regex:desc,$options:'i'}}).skip((page-1)*limit).limit(limit);

createStory = story => {
    story.story_id=ObjectID().str;
    return storyModel.create(story);
};

deleteStory = (storyId) => storyModel.deleteOne({story_id: storyId});

updateStory = (storyID, story) => storyModel.findOneAndUpdate({story_id: storyID}, {$set: story}, {new: true});

const likeStory = (story, userID) => {
    if(!story.liked_by_users.includes(userID)){
        story.liked_by_users.push(userID);
        return story;
    } 
        return story;
    
};

const unlikeStory = (story, userID) => {
    for(let i=0; i<story.liked_by_users.length; i++){
        if(story.liked_by_users[i] === userID){
            story.liked_by_users.splice(i, 1);
            return story;
        }
    }
    return null;
};

module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    findStoryByTitle,
    findTopStories,
    createStory,
    deleteStory,
    updateStory,
    likeStory,
    unlikeStory,
};
