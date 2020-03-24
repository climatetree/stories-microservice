const commentModel = require('../models/comments.model.server')
const ObjectID = require("bson-objectid");

const findAllComments = () => commentModel.find();

const findCommentById = (commentId) => commentModel.findOne({comment_id:commentId});

const deleteComment = (commentId) => commentModel.deleteOne({comment_id:commentId},(err, obj) => {
    if (err) throw err;
    console.log("1 document deleted");
});

const addComment = (userId, comment, date) => {
    const commentId = ObjectID().str;
    return commentModel.create({
        comment_id: commentId,
        date,
        user_id: userId,
        content: comment
    })
};

module.exports = {
    addComment,
    deleteComment,
    findCommentById,
    findAllComments
};
