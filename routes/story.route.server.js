storyDao = require('../dao/story.dao.server');
module.exports = app => {

    findAllStories = (req, res) => 
        storyDao.findAllStories().then(stories => res.json(stories));

    findStoryByStoryID = (req, res) =>
        storyDao.findStoryByStoryID(req.params.storyID).then(story => res.json(story));

    findStoryByPlaceID = (req,res)=>
        storyDao.findStoryByPlaceID(req.params.placeID).exec(function (err,stories) {
            res.send(JSON.stringify(stories, null, '\t'))
    });

    app.get('/stories', findAllStories);
    app.get('/stories/story/:storyID', findStoryByStoryID);
    app.get('/stories/place/:placeID',findStoryByPlaceID);
};