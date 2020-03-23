const storyModel = require('../models/story.model.server');

findAllStories = (limit, page) => storyModel.find().skip((page-1)*limit).limit(limit);

findTopStories = (numberOfStories) => storyModel.find().sort({date: 'desc'}).limit(parseInt(numberOfStories));

findStoryByStoryID = storyID => storyModel.findOne({story_id: storyID});

findStoryByPlaceID = (placeID, limit, page) => storyModel.find({place_ids:{$elemMatch:{$eq:placeID}}}).skip((page-1)*limit).limit(limit);

findStoryByTitle = (title, limit, page) => storyModel.find({story_title:{$regex: title,$options:'i'}}).skip((page-1)*limit).limit(limit);

createStory = story => storyModel.create(story);

deleteStory = (storyId) => storyModel.deleteOne({story_id: storyId});

updateStory = (storyID, story) => storyModel.updateOne({story_id: storyID}, story);

updateLike = (storyID,liked_by_users) => storyModel.updateOne({story_id:storyID},{$set:{liked_by_users:liked_by_users}});

updateComments=(story_id,comments) => storyModel.updateOne({story_id:story_id},{$set:{comments:comments}});

module.exports = {
    findAllStories,
    findStoryByStoryID,
    findStoryByPlaceID,
    findStoryByTitle,
    findTopStories,
    createStory,
    deleteStory,
    updateStory,
    updateLike,
    updateComments
};
