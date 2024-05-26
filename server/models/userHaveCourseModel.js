const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var userHaveCourseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
});

//Export the model
module.exports = mongoose.model('UserHaveCourse', userHaveCourseSchema);