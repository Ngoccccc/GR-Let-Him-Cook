const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var postIngredientSchema = new mongoose.Schema({
    ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    }
});

//Export the model
module.exports = mongoose.model('PostIngredient', postIngredientSchema);