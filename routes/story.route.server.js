const { ObjectID } = require('mongodb');


const storyDao = require('../dao/story.dao.server');
const commentDao = require('../dao/comment.dao.server');


findAllStories = (req, res) => {
    page = 1;
    limit = 100;
    if (req.query.page){
        page = parseInt(req.query.page)
    }
    if (req.query.limit){
        limit = parseInt(req.query.limit)
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
    if (isNaN(page) || isNaN(limit)) { //If non integer values provided for limit or page
        console.log("Error");
        return res.status(500).send({"Error": "Invalid Query Params"})
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
    if (isNaN(page) || isNaN(limit)) { //If non integer values provided for limit or page
        console.log("Error");
        return res.status(500).send({"Error": "Invalid Query Params"})
    }
    storyDao.findStoryByTitle(req.params.title, limit, page).exec((err,stories) => {
        res.json(stories)
    });
};

findTopStories = (req, res) =>
    storyDao.findTopStories(req.params.numberOfStories).then(stories => res.json(stories));

createStory = (req, res) => {
    req.body.story_id=ObjectID().str;
    return storyDao.createStory(req.body)
        .then((story) => res.json(story),
              (error) => res.status(500).send({error}));
};


deleteStory = (req, res) => {
    const {storyId} = req.params;
    if (!ObjectID.isValid(storyId)) {
        return res.status(404).send({error: "Story doesn't exist!"});
    }

    storyDao.deleteStory(storyId).exec((error, removed) => {
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

addLikeUser = (story, userID) => {
    if (!story.liked_by_users.has(userID.toString())) {
        story.liked_by_users.set(userID.toString(),true);
    }
    return story
};

deleteLikeUser = (story, userID) => {
    if (story.liked_by_users.has(userID.toString())) {
        story.liked_by_users.delete(userID.toString());
    }
    return story;
};

const likeStory = (req, res) => {
    const storyID = req.params.storyID;
    if (!ObjectID.isValid(storyID)) {
        return res.status(404).send();
    }
    storyDao.findStoryByStoryID(storyID)
        .then(story => {
            const updatedStory = addLikeUser(story, req.params.userID);
            console.log(updatedStory.liked_by_users);
            storyDao.updateLike(story.story_id, updatedStory.liked_by_users).then(response => {
                res.send(response);
            });
        });
};

const unlikeStory = (req, res) => {
    const storyID = req.params.storyID;
    if (!ObjectID.isValid(storyID)) {
        return res.status(404).send();
    }
    storyDao.findStoryByStoryID(storyID)
        .then(story => {
            const updatedStory = deleteLikeUser(story, req.params.userID);
            if (updatedStory) {
                storyDao.updateLike(story.story_id, updatedStory.liked_by_users).then(response => {
                    res.send(response);
                });
            } else {
                res.send(story);
            }
        });
};

// there is no check for userId being valid here. The expectation is that only validated users would be able to
// navigate to comment page
addComment = (req,res) => {
    const story_id = req.body.story_id;
    storyDao.findStoryByStoryID(story_id).then(story => {
        if(story){
            req.body.comment_id=ObjectID();
            req.body.date=new Date();
            console.log(req.body);
            commentDao.insertComment(req.body).then(comment => {
                console.log(comment);
                story.comments.set(comment.comment_id,comment);
                storyDao.updateComments(story.story_id,story.comments).then(updatedStory => {
                    res.send(updatedStory);
                })
            })
        }else{
            res.status(404).send({
                                     success: false,
                                     message: "Story does not exist or has been deleted."
                                 })
        }
    })
};

// Only allows users to delete their own comment
//Todo: Modify to allow moderators or admin to delete as well.
const deleteComment = (req,res) => {
    const storyId = req.body.story_id;
    const userId = req.body.user_id;
    const commentId = req.body.comment_id;

    storyDao.findStoryByStoryID(storyId).then(story => {
        if(story){
            commentDao.findCommentByCommentID(commentId).then(comment => {
                if(comment){
                    if(comment[0].user_id === userId){
                        story.comments.delete(commentId);
                        commentDao.deleteComment(commentId);
                        storyDao.updateComments(story.story_id,story.comments).then(updatedStory => {
                            res.send(updatedStory)
                        });
                    }else{
                        res.status(403).send({success:false,message:"Not allowed."})
                    }
                }else{
                res.status(404).send({
                                         success: false,
                                         message: "Comment does not exist or has been deleted."});
            }})
        }else{
        res.status(404).send({
                                 success: false,
                                                message: "Story does not exist or has been deleted."});
    }});
};

const findAllComments = (req, res) =>
    commentDao.findAllComments().then(comments => res.json(comments));



module.exports = app => {
    app.get('/stories', findAllStories);
    app.get('/stories/story/:storyID', findStoryByStoryID);
    app.get('/stories/place/:placeID',findStoryByPlaceID);
    app.get('/stories/title/:title',findStoryByTitle);
    app.get('/stories/topStories/:numberOfStories', findTopStories);
    app.post('/stories/create', createStory);
    app.delete('/stories/delete/:storyId', deleteStory);
    app.put('/stories/update/:storyId', updateStory);
    app.put('/stories/:storyID/like/:userID', likeStory);
    app.put('/stories/:storyID/unlike/:userID', unlikeStory);
    app.post('/stories/story/comment',addComment);
    app.get('/stories/comment',findAllComments);
    app.delete('/stories/story/comment',deleteComment);
};
