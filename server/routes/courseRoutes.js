const express = require("express");
const { requireSignIn, isChef } = require("../middlewares/authMiddleware.js");
const {
  createCourse,
  updateCourse,
  getAllCourses,
  registerCourse,
  getCoursesByUserId,
  getAllPostsOfCourse,
  getUnregisteredCourses,
  checkUserHaveCourse,
  getSingleCourse,
} = require("../controllers/courseController.js");

//router object
const router = express.Router();

//routes

router.post("/create-course/", requireSignIn, isChef, createCourse);
router.post("/register-course/:courseId", requireSignIn, registerCourse);
router.put("/update-course/:courseId", requireSignIn, isChef, updateCourse);
// router.delete("/delete-course/:commentId", requireSignIn, deleteComment);
router.get("/get-courses/", getAllCourses);
router.get("/get-user-courses/", requireSignIn, getCoursesByUserId);
router.get("/get-unregistered-courses/", requireSignIn, getUnregisteredCourses);
router.get("/get-post-of-course/:courseId", requireSignIn, getAllPostsOfCourse);
router.get(
  "/check-user-have-course/:courseId",
  requireSignIn,
  checkUserHaveCourse
);
router.get("/get-course-detail/:courseId", getSingleCourse);
module.exports = router;
