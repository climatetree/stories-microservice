const storyModel = require('../models/story.model.server')

findAllStories = () => storyModel.find();

findStoryByStoryID = storyID => storyModel.findOne({_id: storyID});

findStoryByPlaceID = placeID => storyModel.find({place_ids:{$elemMatch:{$eq:placeID}}});

findStoryByTitle = title => storyModel.find({story_title:{$regex: title}})

createStory = story => storyModel.create(story);

deleteStory = storyId => storyModel.remove({_id: storyId});

updateStory = (storyId, story) => storyModel.update({_id: storyId}, {$set: story});

module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    findStoryByTitle,
    createStory,
    deleteStory,
    updateStory,
};
