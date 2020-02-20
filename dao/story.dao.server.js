const storyModel = require('../models/story.model.server')

findAllStories = () => storyModel.find();

findStoryByStoryID = storyID => storyModel.findOne({_id: storyID});

findStoryByPlaceID = placeID => storyModel.find({place_ids:{$elemMatch:{$eq:placeID}}});

findStoryByTitle = title => storyModel.find({story_title:{$regex: title,$options:'i'}});

createStory = story => storyModel.create(story);

deleteStory = (storyId,userID) => storyModel.deleteOne({_id: storyId,user_id:userID});

updateStory = (storyID,userID, story) => storyModel.update({_id: storyID,user_id:userID}, {$set: story});

module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    findStoryByTitle,
    createStory,
    deleteStory,
    updateStory,
};
