const postModel = require("../models/postModel.js");
const postCategoryModel = require("../models/postCategoryModel.js");
const postIngredientModel = require("../models/postIngredientModel.js");
const categoryModel = require("../models/categoryModel.js");
const userHaveCourseModel = require("../models/userHaveCourseModel.js");
const mongoose = require("mongoose");
const createPost = async (req, res) => {
  try {
    const {
      title,
      mediaTitle,
      description,
      ration,
      level,
      video,
      intendTime,
      steps,
      courseId,
      ingredients,
      categories,
    } = req.body;

    // Kiểm tra xem có đủ dữ liệu không
    if (
      !title ||
      !mediaTitle ||
      !description ||
      !ration ||
      !level ||
      !intendTime ||
      !steps ||
      !ingredients ||
      !categories
    ) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }
    console.log(req.user);
    let status = "";
    if (req.user.role === "admin") {
      status = "published";
    } else if (req.user.role === "chef") {
      status = "waiting";
    } else {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access: You are not allowed to create a post",
      });
    }

    const post = await new postModel({
      userId: req.user._id,
      title,
      mediaTitle,
      description,
      ration,
      video,
      level,
      intendTime,
      steps,
      status,
      courseId,
    }).save();

    ingredients.forEach(async (ingredient, index) => {
      const postIngredient = new postIngredientModel({
        postId: post._id,
        ingredientId: ingredient.id,
        quantity: ingredient.quantity,
        order: index + 1,
      });
      try {
        await postIngredient.save();
      } catch (error) {
        console.error("Error saving post ingredient:", error);
      }
    });

    categories.forEach(async (category) => {
      const PostCategory = new postCategoryModel({
        postId: post._id,
        categoryId: category,
      });
      try {
        await PostCategory.save();
      } catch (error) {
        console.error("Error saving post category:", error);
      }
    });
    res.status(201).send({
      success: true,
      message: "New post created",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating post",
      error,
    });
  }
};

//update category
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const {
      title,
      mediaTitle,
      description,
      ration,
      level,
      intendTime,
      steps,
      video,
      courseId,
      ingredients,
      categories,
    } = req.body;

    // Kiểm tra xem có đủ dữ liệu không
    if (
      !title ||
      !mediaTitle ||
      !description ||
      !ration ||
      !level ||
      !intendTime ||
      !steps ||
      !ingredients ||
      !categories
    ) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "chef") {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access: You are not allowed to update this post",
      });
    }

    if (
      req.user.role === "chef" &&
      post.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access: You are not allowed to update this post",
      });
    }

    let updatedStatus = "";
    if (req.user.role === "admin") {
      updatedStatus = "published";
    } else if (req.user.role === "chef") {
      updatedStatus = "waiting";
    }

    const postUpdate = await postModel.findByIdAndUpdate(postId, {
      userId: req.user._id,
      title,
      mediaTitle,
      description,
      ration,
      level,
      intendTime,
      video,
      steps,
      status: updatedStatus,
      courseId,
    });

    console.log(ingredients);
    await postIngredientModel.deleteMany({ postId });
    await postCategoryModel.deleteMany({ postId });

    ingredients.forEach(async (ingredient, index) => {
      const postIngredient = new postIngredientModel({
        postId,
        ingredientId: ingredient.id,
        quantity: ingredient.quantity,
        order: index + 1,
      });
      try {
        await postIngredient.save();
      } catch (error) {
        console.error("Error updating post ingredient:", error);
      }
    });

    categories.forEach(async (category) => {
      const PostCategory = new postCategoryModel({
        postId,
        categoryId: category,
      });
      try {
        await PostCategory.save();
      } catch (error) {
        console.error("Error updating post category:", error);
      }
    });
    res.status(201).send({
      success: true,
      message: "Post updated",
      postUpdate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating post",
      error,
    });
  }
};

// get all post
const getAllPost = async (req, res) => {
  try {
    const posts = await postModel
      .find({})
      .sort({ createAt: -1 })
      .populate("userId", "name")
      .populate("courseId", "name")
      .select("_id title mediaTitle userId");
    console.log(posts);
    res.status(200).send({
      success: true,
      message: "All Post List",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all posts",
    });
  }
};

const getNewPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({ courseId: null })
      .sort({ createAt: -1 })
      .limit(6)
      .select("_id title mediaTitle level intendTime likeCount");
    console.log(posts);
    res.status(200).send({
      success: true,
      message: "All Post List",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all posts",
    });
  }
};

const getMostFavoritePosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({ courseId: null })
      .sort({ likeCount: -1 })
      .limit(4)
      .select("_id title mediaTitle level intendTime likeCount");
    console.log(posts);
    res.status(200).send({
      success: true,
      message: "All Post List",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all posts",
    });
  }
};
// single post
const getSinglePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({
        success: false,
        message: "Invalid params",
      });
    }
    var post = await postModel
      .findOne({ _id: req.params.id })
      .populate("userId", "name")
      .lean();
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }
    const postIngredient = await postIngredientModel
      .find({
        postId: req.params.id,
      })
      .populate("ingredientId", "name slug unit")
      .sort({ order: 1 })
      .lean();

    const postCategories = await postCategoryModel
      .find({ postId: req.params.id })
      .populate("categoryId");
    const transformedCategories = postCategories.map((item) => ({
      _id: item.categoryId._id,
      name: item.categoryId.name,
      slug: item.categoryId.slug,
    }));
    const transformedIngredients = postIngredient.map((item) => ({
      _id: item.ingredientId._id,
      name: item.ingredientId.name,
      slug: item.ingredientId.slug,
      unit: item.ingredientId.unit,
      quantity: item.quantity,
      order: item.order,
    }));
    post = {
      ...post,
      ingredients: transformedIngredients,
      categories: transformedCategories,
    };
    return res.status(200).send({
      success: true,
      message: "Get SIngle Post Successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Post",
    });
  }
};

// get post of category
const getPostOfCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const category = await categoryModel.findOne({ slug: categorySlug });
    const postOfCategory = await postCategoryModel
      .find({
        categoryId: category._id,
      })
      .populate({
        path: "postId",
        match: {
          status: "published",
          courseId: null,
        },
        select: "_id title mediaTitle level intendTime likeCount",
      });

    const filteredPosts = postOfCategory.filter((item) => item.postId !== null);

    res.status(200).send({
      success: true,
      message: "Get SIngle Post Successfully",
      category: category,
      postOfCategory: filteredPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Post",
    });
  }
};

const getPostOfCategories = async (req, res) => {
  try {
    const { categoryIds, currentPostId } = req.body;
    const posts = await postCategoryModel.aggregate([
      {
        $match: {
          categoryId: {
            $in: categoryIds.map((id) => mongoose.Types.ObjectId(id)),
          },
        },
      },
      {
        $group: {
          _id: "$postId",
        },
      },
      {
        $lookup: {
          from: "posts", // Tên collection 'Post' trong MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "postDetails",
        },
      },
      {
        $unwind: "$postDetails",
      },
      {
        $match: {
          "postDetails.status": "published",
          "postDetails.courseId": null,
          "postDetails._id": { $ne: mongoose.Types.ObjectId(currentPostId) },
        },
      },
      {
        $project: {
          _id: "$postDetails._id",
          title: "$postDetails.title",
          mediaTitle: "$postDetails.mediaTitle",
          level: "$postDetails.level",
          intendTime: "$postDetails.intendTime",
          likeCount: "$postDetails.likeCount",
        },
      },
    ]);

    return res.status(200).send({
      success: true,
      message: "Get Post by Categories Successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts by categories:", error);
    throw error;
  }
};

const getAllPostGroupByCategory = async (req, res) => {
  try {
    const posts = await postCategoryModel
      .aggregate([
        {
          $lookup: {
            from: "categories", // Tên của bảng CategoryModel trong cơ sở dữ liệu
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $lookup: {
            from: "posts", // Tên của bảng PostModel trong cơ sở dữ liệu
            localField: "postId",
            foreignField: "_id",
            as: "post",
          },
        },
        {
          $unwind: "$post",
        },
        {
          $match: {
            "post.status": "published", // Chỉ lấy các bài post có trạng thái là "published"
            "post.courseId": null, // Chỉ lấy các bài post có courseId là null
          },
        },
        {
          $group: {
            _id: "$category.name", // Group by the category name
            posts: {
              $push: {
                _id: "$post._id",
                title: "$post.title",
                mediaTitle: "$post.mediaTitle",
                level: "$post.level",
                intendTime: "$post.intendTime",
              },
            },
          },
        },
        {
          $project: {
            name: "$_id", // Đổi tên trường _id thành name
            posts: 1, // Giữ nguyên trường posts
            _id: 0,
          },
        },
      ])
      .exec((err, result) => {
        res.status(200).send({
          success: true,
          message: "Get post by category Successfully",
          result,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get post by category",
      error,
    });
  }
};
//delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }
    console.log(req.user.role);
    if (req.user.role !== "admin" && req.user.role !== "chef") {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access: You are not allowed to delete this post",
      });
    }

    if (
      req.user.role === "chef" &&
      post.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access: You are not allowed to delete this post",
      });
    }

    await postModel.findByIdAndDelete(id);
    await postIngredientModel.deleteMany({ postId: id });
    await postCategoryModel.deleteMany({ postId: id });
    res.status(200).send({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting post",
      error,
    });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getSinglePost,
  getPostOfCategory,
  getAllPostGroupByCategory,
  getNewPosts,
  getMostFavoritePosts,
  getPostOfCategories,
};
