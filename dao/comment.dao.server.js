const commentModel = require('../models/comments.model.server')
var ObjectID = require("bson-objectid");

let findAllComments = () => commentModel.find();

let findCommentById = (commentId) => commentModel.findOne({comment_id:commentId});

let deleteComment = (commentId) => commentModel.deleteOne({comment_id:commentId},function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
});

let addComment = (userId, comment, date) => {
    const commentId = ObjectID().str;
    return commentModel.create({
        comment_id: commentId,
        date: date,
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
