const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "published", "disabled"],
    default: "waiting",
  },
});

//Export the model
module.exports = mongoose.model("Course", courseSchema);
