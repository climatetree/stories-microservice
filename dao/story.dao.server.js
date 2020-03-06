const storyModel = require('../models/story.model.server')
var ObjectID = require("bson-objectid");

findAllStories = () => storyModel.find();

findStoryByStoryID = storyID => storyModel.findOne({story_id: storyID});

findStoryByPlaceID = placeID => storyModel.find({place_ids:{$elemMatch:{$eq:placeID}}});

findStoryByTitle = title => storyModel.find({story_title:{$regex: title,$options:'i'}});

createStory = story => {
    story['story_id']=ObjectID().str;
    return storyModel.create(story);
};

deleteStory = (storyId) => storyModel.deleteOne({story_id: storyId});

updateStory = (storyID, story) => storyModel.update({story_id: storyID}, {$set: story});

likeStory = (story, userID) => {
    if(!story.liked_by_users.includes(userID)){
        story.liked_by_users.push(userID);
        return story;
    } else {
        return story;
    }
}

module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    findStoryByTitle,
    createStory,
    deleteStory,
    updateStory,
    likeStory,
};
