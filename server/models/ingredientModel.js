const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
});

//Export the model
module.exports = mongoose.model('Ingredient', ingredientSchema);