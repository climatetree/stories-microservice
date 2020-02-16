storyDao = require('../dao/story.dao.server');
module.exports = app => {

    findAllStories = (req, res) => 
        storyDao.findAllStories().then(stories => res.json(stories));

    findStoryByStoryID = (req, res) =>
        storyDao.findStoryByStoryID(req.params.storyID).then(story => res.json(story));

    findStoryByPlaceID = (req,res)=>
        storyDao.findStoryByPlaceID(req.params.placeID).exec(function (err,stories) {
            console.log(stories);
            res.send(JSON.stringify(stories, null, '\t'))
    });


    findStoryByTitle = (req,res)=>
        storyDao.findStoryByTitle(req.params.title).exec(function (err,stories) {
            console.log(req.params.title);
            res.send(JSON.stringify(stories, null, '\t'))
        });

    createStory = (req, res) =>
        storyDao.createStory(req.body).then(story => res.json(story));

    deleteStory = (req, res) =>
        storyDao.deleteStory(req.params.storyId).then(story => res.json(story));

    updateStory = (req, res) =>
        storyDao.updateStory(req.params.storyId, req.body).then(story => res.json(story));
  

    app.get('/stories', findAllStories);
    app.get('/stories/story/:storyID', findStoryByStoryID);
    app.get('/stories/place/:placeID',findStoryByPlaceID);
    app.get('/stories/title/:title',findStoryByTitle)
    app.post('/stories/create', createStory);
    app.delete('/stories/delete/:storyId', deleteStory);
    app.put('/stories/update/:storyId', updateStory);
};