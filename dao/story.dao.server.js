const storyModel = require('../models/story.model.server')

findAllStories = () =>
    storyModel.find()

findStoryById = storyId =>
    storyModel.find({"story_id": storyId})

module.exports = {
    findAllStories,
    findStoryById
}
