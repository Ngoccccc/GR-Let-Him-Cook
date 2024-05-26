const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var postCategorySchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
});

//Export the model
module.exports = mongoose.model('PostCategory', postCategorySchema);