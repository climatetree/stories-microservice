const storyModel = require('../models/story.model.server')
var ObjectID = require("bson-objectid");

findAllStories = (limit, page) => storyModel.find().skip((page-1)*limit).limit(limit);

findTopStories = (numberOfStories) => storyModel.find().sort({date: 'desc'}).limit(parseInt(numberOfStories));

findStoryByStoryID = storyID => storyModel.findOne({story_id: storyID});

findStoryByPlaceID = (placeID, limit, page) => storyModel.find({place_ids:{$elemMatch:{$eq:placeID}}}).skip((page-1)*limit).limit(limit);

findStoryByTitle = title => storyModel.find({story_title:{$regex: title,$options:'i'}});

createStory = story => {
    story['story_id']=ObjectID().str;
    return storyModel.create(story);
};

deleteStory = (storyId) => storyModel.deleteOne({story_id: storyId});

updateStory = (storyID, story) => storyModel.update({story_id: storyID}, {$set: story});

module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    findStoryByTitle,
    findTopStories,
    createStory,
    deleteStory,
    updateStory,
};
