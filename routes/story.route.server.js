storyDao = require('../dao/story.dao.server')
module.exports = app => {

    findAllStories = (req, res) => 
        storyDao.findAllStories().then(stories => res.json(stories))

    findStoryById = (req, res) =>
        storyDao.findStoryById(req.params.storyId).then(story => res.json(story))

    app.get('/stories/story/:storyId', findStoryById)
    app.get('/stories', findAllStories)

}