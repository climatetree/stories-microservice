const commentModel = require('../models/comments.model.server');

findAllComments = () => commentModel.find();

findCommentByCommentID = (commentId) => commentModel.find({comment_id:commentId});

findCommentByUserID = (userId) => commentModel.find({user_id: userId});

findCommentByStoryID=(storyId)=>commentModel.find({storyId:storyId});

deleteComment = (commentId) => commentModel.deleteOne({comment_id:commentId});

updateComment = (comment) => commentModel.updateOne({comment_id: comment.comment_id}, {$set:{content: comment.content}});

insertComment = (comment) => commentModel.create(comment);

module.exports = {
    insertComment,
    updateComment,
    deleteComment,
    findCommentByCommentID,
    findAllComments,
    findCommentByUserID,
    findCommentByStoryID
};