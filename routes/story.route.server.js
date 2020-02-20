const { ObjectID } = require('mongodb');


storyDao = require('../dao/story.dao.server');
module.exports = app => {

    findAllStories = (req, res) => 
        storyDao.findAllStories().then(stories => res.json(stories));

    findStoryByStoryID = (req, res) => {
        if(!ObjectID.isValid(req.params.storyID)) {
            return res.status(404).send({
                message: "Story doesn't exist!"
            });
        }

        storyDao.findStoryByStoryID(req.params.storyID).then(story => {
            console.log(story);

            if(!story) {
                return res.status(404).send();
            }
            res.json(story);
        }).catch((error) => {
            res.status(500).send({error});
        });
    }


    findStoryByPlaceID = (req,res)=>
        storyDao.findStoryByPlaceID(req.params.placeID).exec(function (error,stories) {
            console.log(stories);
            if(err) {
                res.status(500).send({error});
            }
            res.json(stories)

    });


    findStoryByTitle = (req,res)=>
        storyDao.findStoryByTitle(req.params.title).exec(function (err,stories) {
            res.json(stories)
        });

    createStory = (req, res) =>
        storyDao.createStory(req.body)
                .then((story) => res.json(story),
                      (error) => res.status(500).send({error}));   
                

    deleteStory = (req, res) => {
        const {storyId} = req.params;
        if (!ObjectID.isValid(storyId)) {
            return res.status(404).send({error: "Story doesn't exist!"});
          }

        storyDao.deleteStory(req.params.storyId,req.params.userId).then((error, removed) => {
            if(error) {
                return res.status(500).send({error});
            }
            
            res.json(removed);
        });
                                     
    }

    updateStory = (req, res) => {
        const {storyId} = req.params;
        if (!ObjectID.isValid(storyId)) {
            return res.status(404).send();
          }
        storyDao.updateStory(req.params.storyId,req.params.userId, req.body)
                .then(story => res.json(story))
                .catch((error) => res.status(500).send({error}));
    }
  

    app.get('/stories', findAllStories);
    app.get('/stories/story/:storyID', findStoryByStoryID);
    app.get('/stories/place/:placeID',findStoryByPlaceID);
    app.get('/stories/title/:title',findStoryByTitle)
    app.post('/stories/create', createStory);
    app.delete('/stories/delete/:userId/:storyId', deleteStory);
    app.put('/stories/update/:userId/:storyId', updateStory);
};