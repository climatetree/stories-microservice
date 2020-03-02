const commentModel = require('../models/comments.model.server')

findCommentByUser = (userId) => commentModel.find({user_id: userId});

findAllComments = () => commentModel.find();

findCommentById = (commentId) => commentModel.findById(commentId);

deleteComment = (commentId) => commentModel.deleteOne({"_id":commentId},function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
});

editComment = (commentId, comment) => {
    return commentModel.updateOne({_id: commentId}, {$set:{text: comment.text}})
};



addComment = (userId, comment, date) => {

    return commentModel.create({
        date: date,
        user_id: userId,
        content: comment
    })
};

module.exports = {
    addComment,
    editComment,
    deleteComment,
    findCommentById,
    findAllComments,
    findCommentByUser
};
