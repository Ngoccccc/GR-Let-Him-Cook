const express = require('express');
const { requireSignIn } = require("../middlewares/authMiddleware.js")
const {
    createComment, updateComment, deleteComment, getCommentsByPostId
} = require("../controllers/commentController.js");

//router object
const router = express.Router();

//routes

router.post("/create-comment/:postId", requireSignIn, createComment);
router.put("/update-comment/:commentId", requireSignIn, updateComment);
router.delete("/delete-comment/:commentId", requireSignIn, deleteComment);
router.get("/get-comments/:postId", getCommentsByPostId);
module.exports = router