const ObjectID = require("bson-objectid");
const storyDao = require('../dao/es.story.dao.server');
const role=require('../constants/role');
const commentDao=require('../dao/comment.dao.server');
const taxonomyDao=require('../dao/taxonomy.dao.server');
const mediaTypeDao=require('../dao/media.dao.server');
let grabity = require("grabity");

module.exports = app => {
    const findAllStories = (req, res) => {
        page = 1;
        limit = 100;
        if (req.query.page) {
            page = parseInt(req.query.page)
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findAllStories(limit, page, stories => res.json(stories),
                                err => res.status(500).send({err}));};


    const findAllTaxonomy=(req,res)=>{
        taxonomyDao.findAllTaxonomy().then(story=>res.json(story))};

    const findTaxonomyBySolution=(req,res)=>{
        taxonomyDao.findTaxonomyBySolution(req.params.solution).then(result=>res.json(result));
    };
    const findTaxonomyBySector=(req,res)=>{
        taxonomyDao.findTaxonomyBySector(req.params.sector).then(result=>res.json(result));
    };
    const findTaxonomyByStrategy=(req,res)=>{
        taxonomyDao.findTaxonomyByStrategy(req.params.strategy).then(result=>res.json(result));
    };

    const findStoryByStoryID = (req, res) => {
        if (!ObjectID.isValid(req.params.storyID)) {
            return res.status(404).send({message: "Story doesn't exist!"});
        }
        storyDao.findStoryByStoryID(req.params.storyID,story => {
            if(story.length===0) {
                return res.status(404).send();
            }
            res.json(story[0]);
        },(error) =>
            res.status(500).send({error}))};

    const findStoryByPlaceID=(req,res)=>{
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
        storyDao.findStoryByPlaceID(req.params.placeID, limit, page,
                                    stories=> res.json(stories),
                                    error=>res.status(500).send({error}))};

    const findStoryByTitle=(req,res)=>{
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
        storyDao.findStoryByTitle(req.params.title, limit, page,
                                  stories=> res.json(stories),
                                  error=>res.status(500).send({error}))
    };

    const findStoryByDescription=(req,res)=>{
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
        storyDao.findStoryByDescription(req.params.description, limit, page,
                                  stories=> res.json(stories),
                                  error=>res.status(500).send({error}))
    };

    const findTopStories=(req,res)=>{
        storyDao.findTopStories(req.params.numberOfStories,
                                stories => res.json(stories),
                                error=>res.status(500).send({error}));
    };

    const findUnratedStories=(req,res)=>{
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

        storyDao.findUnratedStories(limit, page,stories => res.json(stories),
                                    error=>res.status(500).send({error}));
    };

    const createStory = (req, res) => {
        req.body.story_id = ObjectID().str;
        storyDao.createStory(req.body, (story) => res.json(story),
                             (error) => res.status(500).send({error}));};

    const deleteStory=(req,res)=>{
        const {storyId} = req.params;
        if (!ObjectID.isValid(storyId)) {
            return res.status(404).send({error: "Story doesn't exist!"});
        }

        storyDao.deleteStory(storyId,
                             story=>res.json(story),
                             error=>res.status(500).send({error}))
    };

    const updateStory=(req,res)=>{
        const {storyId} = req.params;
        if (!ObjectID.isValid(storyId)) {
            return res.status(404).send();
        }
        storyDao.updateStory(storyId, req.body,
                             story => res.json(story),
                             (error) => res.status(500).send({error}))
    };

    const getPreview = async (req,res) => {
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

    const likeStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID,story => {
            if(story.length===0) {
                return res.status(404).send();
            }
            const updatedStory = storyDao.likeStory(story[0], parseInt(req.params.userID,10));
            storyDao.updateStory(story[0].story_id, updatedStory,response => {
                res.send(response);
            },err=>res.status(500).send({err}));
        },err=>res.status(500).send({err}))
    };

    const unlikeStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID,story => {
            const updatedStory = storyDao.unlikeStory(story[0], parseInt(req.params.userID,10));
            if(updatedStory) {
                storyDao.updateStory(story[0].story_id, updatedStory,response => {
                    res.send(response);
                },err=>res.status(500).send({err}));
            } else {
                res.send(story[0]);
            }
        },err=>res.status(500).send({err}))
    };

    const flagStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID,story => {
            if(story.length===0) {
                return res.status(404).send();
            }
            let user_id =  parseInt(req.params.userID,10);
            if(isNaN(user_id)){
                console.log("User id not a number");
                return res.status(400).send({"Error": "Invalid Query Params"})
            }
            const updatedStory = storyDao.flagStory(story[0], user_id);
            storyDao.updateStory(story[0].story_id, updatedStory,response => {
                res.send(response);
            },err=>res.status(500).send({err}));
        },err=>res.status(500).send({err}));
    };

    const unflagStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID,story => {
            if(story.length===0) {
                return res.status(404).send();
            }
            let user_id =  parseInt(req.params.userID,10);
            if(isNaN(user_id)){
                console.log("User id not a number");
                return res.status(400).send({"Error": "Invalid Query Params"})
            }
            const updatedStory = storyDao.unflagStory(story[0], user_id);
            if(updatedStory) {
                storyDao.updateStory(story[0].story_id, updatedStory,response => {
                    res.send(response);
                },err=>res.status(500).send({err}));
            } else {
                res.send(story[0]);
            }
        },err=>res.status(500).send({err}));
    };

    const addRatingToStory = (req, res) => {
        if (!ObjectID.isValid(req.body.storyID)) {
            return res.status(404).send();
        }

        if(req.body.role) {
            if(req.body.role === role.MODERATOR || req.body.role === role.ADMIN) {
                storyDao.findStoryByStoryID(req.body.storyID,(story) => {
                    if(story.length===0) {
                        return res.status(404).send();
                    }
                    story[0].rating = req.body.rating;
                    storyDao.updateStory(story[0].story_id, story[0],(response) => {
                        res.status(200).send(response);
                    },err=>res.status(500).send({err}));
                },err=>res.status(500).send({err}));
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

        storyDao.findStoryByStoryID(storyId,story => {
            if(story.length!==0){
                commentDao.addComment(userId,content,date,username).then(comment => {
                    story[0].comments.push(comment);
                    storyDao.updateStory(story[0].story_id,story[0],(result) => {
                        res.send(comment);
                    },err=>res.status(500).send({err}));
                });
            }
            else{
                res.status(403).send({
                                         success: false,
                                         message: "Story does not exist or has been deleted."
                                     })
            }
        },err=>res.status(500).send({err}))
    };

    // Only allows users to delete their own comment. Moderators and Admin can delete any comment.
    const deleteComment = (req, res) => {
        const storyId = req.body.storyId;
        const userId = req.body.userId;
        const commentId = req.body.commentId;
        const user_role = req.body.role;

        storyDao.findStoryByStoryID(storyId,story => {
            if (story.length!==0) {
                commentDao.findCommentById(commentId).then(comment => {
                    if (comment) {
                        if ((comment.user_id === userId && user_role === role.REGISTERED_USER)
                            || user_role === role.ADMIN || user_role === role.MODERATOR) {
                            story[0].comments = story[0].comments.filter(update => update.comment_id !== commentId);
                            commentDao.deleteComment(commentId);
                            storyDao.updateStory(story[0].story_id, story[0],(result) => {
                                res.status(200).send();
                            },err=>res.status(500).send({err}));
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
        },err=>res.status(500).send({err}));
    };

    const findAllComments = (req, res) =>
        commentDao.findAllComments().then(comments => res.json(comments));

    const getSortedByFlagged=(req,res)=>{
        const numberOfStoriesToSend = parseInt(req.params.numberOfStories);
        if (isNaN(numberOfStoriesToSend) || numberOfStoriesToSend <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.getSortedFlagged(numberOfStoriesToSend,
                                  stories => res.json(stories),
                                  err=>res.status(500).send({err}));
    };

    const advancedSearch=(req,res)=>{
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

        storyDao.advancedSearch(req.body,limit,page,stories=>res.json(stories),
                                err=>res.status(500).send({err}))
    };

    const findStoryByUserID=(req,res)=>{
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

        let userID=req.params.userID;
        if (isNaN(userID)|| userID < 0 ) {
            console.log("Error");
            return res.status(400).send({"Error": "Invalid UserID"})
        }

        storyDao.findStoryByUserID(userID,limit,page,stories=>res.json(stories),
                                err=>res.status(500).send({err}))
    };

    let getAllMediaTypes = (req, res) => {
        mediaTypeDao.getAllMediaTypes().then(types => {
            return res.status(200).send(types);
        });
    };

    const findStoryBySolution=(req,res)=>{
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
        storyDao.findStoryBySolution(req.params.solution, limit, page,
                                    stories=> res.json(stories),
                                    error=>res.status(500).send({error}))};

    const findStoryBySector=(req,res)=>{
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
        storyDao.findStoryBySector(req.params.sector, limit, page,
                                    stories=> res.json(stories),
                                    error=>res.status(500).send({error}))};

    const findStoryByStrategy=(req,res)=>{
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
        storyDao.findStoryByStrategy(req.params.strategy, limit, page,
                                    stories=> res.json(stories),
                                    error=>res.status(500).send({error}))};


    const findAllSolution=(req,res)=>{
        taxonomyDao.findAllSolution().then(result=>res.json(result));
    };


    const findAllSector=(req,res)=>{
        taxonomyDao.findAllSector().then(result=>res.json(result));
    };


    app.get('/v1/stories', findAllStories);
    app.get('/v1/stories/story/:storyID', findStoryByStoryID);
    app.get('/v1/stories/place/:placeID',findStoryByPlaceID);
    app.get('/v1/stories/title/:title',findStoryByTitle);
    app.get('/v1/stories/topStories/:numberOfStories', findTopStories);
    app.get('/v1/stories/unrated', findUnratedStories);
    app.get('/v1/stories/description/:description',findStoryByDescription);
    app.get('/v1/stories/sector/:sector', findStoryBySector);
    app.get('/v1/stories/solution/:solution', findStoryBySolution);
    app.get('/v1/stories/strategy/:strategy', findStoryByStrategy);
    app.get('/v1/stories/flagged/sorted/:numberOfStories', getSortedByFlagged);
    app.get('/v1/stories/user/:userID',findStoryByUserID);
    app.post('/v1/stories/search',advancedSearch);
    app.post('/v1/stories/create', createStory);
    app.delete('/v1/stories/delete/:storyId', deleteStory);
    app.put('/v1/stories/update/:storyId', updateStory);
    app.put('/v1/stories/:storyID/like/:userID', likeStory);
    app.put('/v1/stories/:storyID/unlike/:userID', unlikeStory);
    app.put('/v1/stories/:storyID/flag/:userID', flagStory);
    app.put('/v1/stories/:storyID/unflag/:userID', unflagStory);
    app.put('/v1/stories/rating/update', addRatingToStory);

    //Comments
    app.post('/v1/stories/story/comment',addComment);
    app.get('/v1/stories/comment',findAllComments);
    app.delete('/v1/stories/story/comment',deleteComment);
    // preview
    app.get('/v1/stories/getPreview',getPreview);

    //taxonomy
    app.get('/v1/stories/taxonomy',findAllTaxonomy);
    app.get('/v1/stories/taxonomy/solution/:solution',findTaxonomyBySolution);
    app.get('/v1/stories/taxonomy/strategy/:strategy',findTaxonomyByStrategy);
    app.get('/v1/stories/taxonomy/sector/:sector',findTaxonomyBySector);


    app.get('/v1/stories/taxonomy/all/solution',findAllSolution);
    app.get('/v1/stories/taxonomy/all/sector',findAllSector);

    //Media types
    app.get('/v1/stories/mediaTypes', getAllMediaTypes);
};

