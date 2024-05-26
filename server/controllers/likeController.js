const likeModel = require("../models/likeModel.js");
const postModel = require("../models/postModel.js");
const userModel = require("../models/userModel.js");
//like post
const like = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    // Kiểm tra xem post có tồn tại không
    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Kiểm tra xem user có tồn tại không
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const existingLike = await likeModel.findOne({ postId, userId });
    if (existingLike) {
      return res
        .status(400)
        .json({ success: false, message: "Post already liked" });
    }

    // Tạo một lượt thích mới
    const like = new likeModel({
      userId,
      postId,
    });
    await like.save();
    post.likeCount++;
    await post.save();
    return res
      .status(200)
      .json({ success: true, message: "Post liked successfully", liked: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Like false",
      error,
    });
  }
};

//like post
const unlike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    // Kiểm tra xem post có tồn tại không
    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Kiểm tra xem user có tồn tại không
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // unlike
    const unlike = await likeModel.deleteOne({ postId, userId });
    if (unlike.deletedCount === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Post has not been liked" });
    }
    post.likeCount--;
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      liked: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unlike false",
      error,
    });
  }
};

const checkLikeStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user ? req.user._id : null;

    if (!userId) {
      return res.status(200).json({
        liked: false,
      });
    }

    const likeStatus = await likeModel.findOne({ postId, userId });
    return res.status(200).json({
      liked: !!likeStatus,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const likedPosts = await likeModel
      .find({ userId })
      .populate("postId", "_id title mediaTitle level intendTime likeCount");
    return res.status(200).json({
      success: true,
      message: "User liked posts retrieved successfully",
      likedPosts,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { like, unlike, getLikedPosts, checkLikeStatus };
