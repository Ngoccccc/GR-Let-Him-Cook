const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware.js");
const {
  like,
  unlike,
  getLikedPosts,
  checkLikeStatus,
} = require("../controllers/likeController.js");

//router object
const router = express.Router();

//routes

router.post("/like-post/:postId", requireSignIn, like);
router.post("/unlike-post/:postId", requireSignIn, unlike);
router.get("/get-liked-posts/", requireSignIn, getLikedPosts);
router.get("/like-status/:postId", requireSignIn, checkLikeStatus);
module.exports = router;
