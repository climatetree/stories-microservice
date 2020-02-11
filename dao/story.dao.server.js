const storyModel = require('../models/story.model.server')

findAllStories = () => storyModel.find();

findStoryByStoryID = storyID => storyModel.findOne({_id: storyID});

findStoryByPlaceID = placeID => storyModel.find({place_ids:{$elemMatch:{$eq:placeID}}});

createStory = story => storyModel.create(story);

deleteStory = storyId => storyModel.remove({_id: storyId});

updateStory = (storyId, story) => storyModel.update({_id: storyId}, {$set: story});

module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    createStory,
    deleteStory,
    updateStory
};
