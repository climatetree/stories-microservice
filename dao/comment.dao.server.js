const commentModel = require('../models/comments.model.server')

findAllComments = () => commentModel.find();

findCommentById = (commentId) => commentModel.findById(commentId);

deleteComment = (commentId) => commentModel.deleteOne({"_id":commentId},function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
});

addComment = (userId, comment, date) => {

    return commentModel.create({
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
