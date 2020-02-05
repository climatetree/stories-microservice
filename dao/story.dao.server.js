const StoryModel = require('../models/story.model.server')

findAllStories = () =>
    StoryModel.find()

findStoryById = storyId =>
    StoryModel.findOne({"story_id": storyId})

module.exports = {
    findAllStories,
    findStoryById
}
