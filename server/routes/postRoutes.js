const express = require("express");
const {
  requireSignIn,
  isAdmin,
  assignRole,
} = require("../middlewares/authMiddleware.js");
const {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getSinglePost,
  getPostOfCategory,
  approvePost,
  getAllPostGroupByCategory,
  getNewPosts,
  getMostFavoritePosts,
  getPostOfCategories,
  getPostsUnapproved,
} = require("../controllers/postController.js");

//router object
const router = express.Router();

//routes

//getALl post
router.get("/get-posts", getAllPost);
router.get("/get-new-posts", getNewPosts);
router.post("/get-same-posts", getPostOfCategories);
router.get("/get-favorite-posts", getMostFavoritePosts);
router.get("/get-post/:id", assignRole, getSinglePost);
router.get("/get-post-by-category/:categorySlug", getPostOfCategory);
router.get("/get-posts-by-category", getAllPostGroupByCategory);
//single post
// router.get("/single-post/:slug", getSingleCategory);
router.get("/get-waiting-posts", requireSignIn, isAdmin, getPostsUnapproved);
router.put("/approve-post/:id", requireSignIn, isAdmin, approvePost);

// create post
router.post("/create-post", requireSignIn, createPost);

//update post
router.put("/update-post/:id", requireSignIn, updatePost);

router.delete("/delete-post/:id", requireSignIn, deletePost);

module.exports = router;
