const commentModel = require('../models/comments.model.server')
const ObjectID = require("bson-objectid");

const findAllComments = () => commentModel.find();

const findCommentById = (commentId) => commentModel.findOne({comment_id:commentId});

const deleteComment = (commentId) => commentModel.deleteOne({comment_id:commentId},(err, obj) => {
    if (err) throw err;
    console.log("1 document deleted");
});

const addComment = (userId, comment, date, username) => {
    const commentId = ObjectID().str;
    return commentModel.create({
        comment_id: commentId,
        user_id: userId,
        user_name: username,
        content: comment,
        date: date
    })
};

module.exports = {
    addComment,
    deleteComment,
    findCommentById,
    findAllComments
};
