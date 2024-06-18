const commentModel = require("../models/commentModel.js");
const postModel = require("../models/postModel.js");
const userModel = require("../models/userModel.js");
const { transformTimestamp } = require("../utils/dateUtils.js");
//comment post
const createComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;
    const { content, image } = req.body;
    // Kiểm tra xem post có tồn tại không
    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (!content && !image) {
      return res
        .status(404)
        .json({ success: false, message: "not found content or image" });
    }
    // Kiểm tra xem user có tồn tại không
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const comment = new commentModel({ userId, postId, content, image });
    await comment.save();

    return res
      .status(200)
      .json({ success: true, message: "comment successfully", comment });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Comment false",
      error,
    });
  }
};

//comment post
const updateComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const commentId = req.params.commentId;
    const { content, image } = req.body;
    // Kiểm tra xem post có tồn tại không
    let comment = await commentModel
      .findById(commentId)
      .populate("userId", "name")
      .lean();
    console.log(comment);
    // Kiểm tra xem user có tồn tại không
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!comment || comment.userId._id.toString() != userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }
    if (!content && !image) {
      return res
        .status(404)
        .json({ success: false, message: "not found content or image" });
    }

    let updatedComment = await commentModel
      .findByIdAndUpdate(commentId, { content, image }, { new: true })
      .populate("userId", "name")
      .lean();

    updatedComment = {
      ...updatedComment,
      createdAt: transformTimestamp(comment.createdAt),
      updatedAt: transformTimestamp(comment.updatedAt),
    };
    return res.status(200).json({
      success: true,
      message: "comment update successfully",
      updatedComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Comment update false",
      error,
    });
  }
};

//xóa một comment
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    // Xóa comment từ cơ sở dữ liệu
    const deletedComment = await commentModel.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      deletedComment,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller để lấy tất cả các comment của một bài post
const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Tìm tất cả các comment có postId tương ứng
    let comments = await commentModel
      .find({ postId })
      .populate("userId", "name")
      .lean();
    comments = comments.map((comment) => ({
      ...comment,
      createdAt: transformTimestamp(comment.createdAt),
      updatedAt: transformTimestamp(comment.updatedAt),
    }));

    return res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
};
