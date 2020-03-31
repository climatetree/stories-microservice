const { ObjectID } = require('mongodb');


const storyDao = require('../dao/story.dao.server');
const commentDao = require('../dao/comment.dao.server');
const role = require('../constants/role');
let grabity = require("grabity");


module.exports = app => {

    findAllStories = (req, res) => {
        page = 1;
        limit = 100;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findAllStories(limit, page).then(stories => res.json(stories));
    };

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

    findStoryByPlaceID = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }

        storyDao.findStoryByPlaceID(req.params.placeID, limit, page).exec((error,stories) => {
            if(error) {
                res.status(500).send({error});
            }
            res.json(stories);
        });
    };

    findStoryByTitle = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findStoryByTitle(req.params.title, limit, page).exec((err,stories) => {
            res.json(stories)
        });
    };

    findStoryByDescription = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findStoryByDescription(req.params.description, limit, page).exec((err,stories) => {
            res.json(stories)
        });
    };

    findTopStories = (req, res) =>
        storyDao.findTopStories(req.params.numberOfStories).then(stories => res.json(stories));

    findUnratedStories = (req, res) => {
        page = 1
        limit = 20
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error")
            return res.status(400).send({"Error": "Invalid Query Params"})
        }

        storyDao.findUnratedStories(limit, page).exec((err,stories) => {
            res.json(stories)
        });

    }

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

    const likeStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID)
            .then(story => {
                if(!story) {
                    return res.status(404).send();
                }
                const updatedStory = storyDao.likeStory(story, parseInt(req.params.userID,10));
                storyDao.updateStory(story.story_id, updatedStory).then(response => {
                    res.send(response);
                });
            });
    };

    const unlikeStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID)
            .then(story => {
                const updatedStory = storyDao.unlikeStory(story, parseInt(req.params.userID,10));
                if(updatedStory) {
                    storyDao.updateStory(story.story_id, updatedStory).then(response => {
                        res.send(response);
                    });
                } else {
                    res.send(story);
                }
            });
    };

    addRatingToStory = (req, res) => {
        if (!ObjectID.isValid(req.body.storyID)) {
            return res.status(404).send();
          }

        if(req.body.role) {
            if(req.body.role === role.MODERATOR || req.body.role === role.ADMIN) {
                storyDao.findStoryByStoryID(req.body.storyID)
                .then((story) => {
                    story.rating = req.body.rating;
                    storyDao.updateStory(story.story_id, story).then((response) => {
                        res.status(200).send(response);
                    });
                })
            }
            else {
                res.status(401).send();
            }
        }
        else {
            res.status(401).send();
        }
    };

    // there is no check for userId being valid here. The expectation is that only validated users would be able to
    // navigate to comment page
    const addComment = (req,res) => {

        const storyId = req.body.storyId;
        const userId = req.body.userId;
        const content = req.body.content;
        const date = req.body.date;
        const username = req.body.username;

        storyDao.findStoryByStoryID(storyId).then(story => {
            if(story){
                commentDao.addComment(userId,content,date,username).then(comment => {
                    story.comments.push(comment);
                    storyDao.updateStory(story.story_id,story).then(updatedStory => {
                        res.send(updatedStory)
                    })
                });
            }
            else{
                res.status(403).send({
                    success: false,
                    message: "Story does not exist or has been deleted."
                })
            }
        })
    };

    // Only allows users to delete their own comment. Moderators and Admin can delete any comment.
    const deleteComment = (req, res) => {
        const storyId = req.body.storyId;
        const userId = req.body.userId;
        const commentId = req.body.commentId;
        const user_role = req.body.role;

        storyDao.findStoryByStoryID(storyId).then(story => {
            if (story) {
                commentDao.findCommentById(commentId).then(comment => {
                    if (comment) {
                        if ((comment.user_id === userId && user_role === role.REGISTERED_USER)
                            || user_role === role.ADMIN || user_role === role.MODERATOR) {
                            story.comments = story.comments.filter(update => update.comment_id !== commentId);
                            commentDao.deleteComment(commentId);
                            storyDao.updateStory(story.story_id, story).then(() => {
                                res.status(200).send({
                                    success: true,
                                    message: "Comment successfully deleted."
                                });
                            });
                        } else {
                            res.status(403).send({
                                success: false,
                                message: "User can only delete their own comments."
                            });
                        }
                    } else {
                        res.status(403).send({
                            success: false,
                            message: "Comment does not exist or has been deleted."
                        });
                    }
                })
            } else {
                res.status(403).send({
                    success: false,
                    message: "Story does not exist or has been deleted."
                });
            }
        });
    };

    const findAllComments = (req, res) =>
        commentDao.findAllComments().then(comments => res.json(comments));

    let getPreview = async (req,res) => {
        const hyperlink = "" + req.query.hyperlink;
        try{
        let metadata = await grabity.grabIt(hyperlink);
        res.send(metadata);
        } catch(e) {
            res.status(403).send({
                success: false,
                message: "Unable to get metadata due to error in url or timeout"
            });
        }
    };

    app.get('/stories', findAllStories);
    app.get('/stories/story/:storyID', findStoryByStoryID);
    app.get('/stories/place/:placeID',findStoryByPlaceID);
    app.get('/stories/title/:title',findStoryByTitle);
    app.get('/stories/topStories/:numberOfStories', findTopStories)
    app.get('/stories/unrated', findUnratedStories)
    app.get('/stories/description/:description',findStoryByDescription);
    app.post('/stories/create', createStory);
    app.delete('/stories/delete/:storyId', deleteStory);
    app.put('/stories/update/:storyId', updateStory);
    app.put('/stories/:storyID/like/:userID', likeStory);
    app.put('/stories/:storyID/unlike/:userID', unlikeStory);
    app.put('/stories/rating/update', addRatingToStory);
    //Comments
    app.post('/stories/story/comment',addComment);
    app.get('/stories/comment',findAllComments);
    app.delete('/stories/story/comment',deleteComment);
    // preview
    app.get('/stories/getPreview',getPreview);

};   
