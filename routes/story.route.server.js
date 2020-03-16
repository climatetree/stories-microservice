const { ObjectID } = require('mongodb');


storyDao = require('../dao/story.dao.server');

module.exports = app => {

    findAllStories = (req, res) => {
        page = 1
        limit = 100
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        storyDao.findAllStories(limit, page).then(stories => res.json(stories));
    }

    findStoryByStoryID = (req, res) => {
        if(!ObjectID.isValid(req.params.storyID)) {
            return res.status(404).send({
                message: "Story doesn't exist!"
            });
        }

        storyDao.findStoryByStoryID(req.params.storyID).then(story => {
            if(!story) {
                return res.status(404).send();
            }
            res.json(story);
        }).catch((error) => {
            res.status(500).send({error});
        });
    };

    findStoryByPlaceID = (req,res)=>
        storyDao.findStoryByPlaceID(req.params.placeID).exec(function (error,stories) {
            if(error) {
                res.status(500).send({error});
            }
            res.json(stories);

    });

    findStoryByTitle = (req,res)=>
        storyDao.findStoryByTitle(req.params.title).exec(function (err,stories) {
            res.json(stories)
        });

    findTopStories = (req, res) =>
        storyDao.findTopStories(req.params.numberOfStories).then(stories => res.json(stories));

    createStory = (req, res) =>
        storyDao.createStory(req.body)
                .then((story) => res.json(story),
                      (error) => res.status(500).send({error}));   
                

    deleteStory = (req, res) => {
        const {storyId} = req.params;
        if (!ObjectID.isValid(storyId)) {
            return res.status(404).send({error: "Story doesn't exist!"});
          }

        storyDao.deleteStory(storyId).then((error, removed) => {
            if(error) {
                return res.status(500).send({error});
            }
            
            res.json(removed);
        });
    };

    updateStory = (req, res) => {
        const {storyId} = req.params;
        if (!ObjectID.isValid(storyId)) {
            return res.status(404).send();
          }
        storyDao.updateStory(storyId, req.body)
                .then(story => res.json(story))
                .catch((error) => res.status(500).send({error}));
    };

    let likeStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID)
            .then(story => {
                if(!story) {
                    return res.status(404).send();
                }
                const updatedStory = storyDao.likeStory(story, req.params.userID);
                storyDao.updateStory(story.story_id, updatedStory).then(response => {
                    res.send(response);
                });
            });
    };

    let unlikeStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID)
            .then(story => {
                const updatedStory = storyDao.unlikeStory(story, req.params.userID);
                if(updatedStory) {
                    storyDao.updateStory(story.story_id, updatedStory).then(response => {
                        res.send(response);
                    });
                } else {
                    res.send(story);
                }
            });
    };


    app.get('/stories', findAllStories);
    app.get('/stories/story/:storyID', findStoryByStoryID);
    app.get('/stories/place/:placeID',findStoryByPlaceID);
    app.get('/stories/title/:title',findStoryByTitle);
    app.get('/stories/topStories/:numberOfStories', findTopStories)
    app.post('/stories/create', createStory);
    app.delete('/stories/delete/:storyId', deleteStory);
    app.put('/stories/update/:storyId', updateStory);
    app.put('/stories/:storyID/like/:userID', likeStory);
    app.put('/stories/:storyID/unlike/:userID', unlikeStory);
    
};   