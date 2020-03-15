const commentModel = require('../models/comments.model.server')
var ObjectID = require("bson-objectid");

findAllComments = () => commentModel.find();

findCommentById = (commentId) => commentModel.findOne({comment_id:commentId});

deleteComment = (commentId) => commentModel.deleteOne({comment_id:commentId},function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
});

addComment = (userId, comment, date) => {
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
