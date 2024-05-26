const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
});

//Export the model
module.exports = mongoose.model('Like', likeSchema);