const storyModel = require('../models/story.model.server')

findAllStories = () =>
    storyModel.find();

findStoryByStoryID = storyId =>
    storyModel.find({story_id: storyId});

findStoryByPlaceID = placeID => storyModel.find({place_ids:{$all:[placeID]}});


module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID
};
