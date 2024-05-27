const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    mediaTitle: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    ration: {
      type: String,
    },
    level: {
      type: String,
    },
    intendTime: {
      type: String,
    },
    steps: [
      {
        order: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        imageUrls: {
          type: [String],
        },
      },
    ],
    status: {
      type: String,
      enum: ["waiting", "published"],
      require: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Post", postSchema);
