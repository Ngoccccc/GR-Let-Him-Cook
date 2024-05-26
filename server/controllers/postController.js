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
      intendTime,
      steps,
      status,
      courseId,
      ingredients,
      categories,
    } = req.body;

    const post = await new postModel({
      userId: req.user._id,
      title,
      mediaTitle,
      description,
      ration,
      level,
      intendTime,
      steps,
      status,
      courseId,
    }).save();

    ingredients.forEach(async (ingredient, index) => {
      // Tạo một bản ghi mới cho mỗi thành phần nguyên liệu
      const postIngredient = new postIngredientModel({
        postId: post._id, // Lấy id của bài post mới được lưu
        ingredientId: ingredient.id,
        quantity: ingredient.quantity,
        order: index + 1,
      });
      try {
        await postIngredient.save(); // Lưu bản ghi của thành phần nguyên liệu
      } catch (error) {
        console.error("Error saving post ingredient:", error);
        // Xử lý lỗi nếu cần
      }
    });

    categories.forEach(async (category) => {
      // Tạo một bản ghi mới cho mỗi thành phần nguyên liệu
      const PostCategory = new postCategoryModel({
        postId: post._id, // Lấy id của bài post mới được lưu
        categoryId: category,
      });
      try {
        await PostCategory.save(); // Lưu bản ghi của thành phần nguyên liệu
      } catch (error) {
        console.error("Error saving post category:", error);
        // Xử lý lỗi nếu cần
      }
    });
    res.status(201).send({
      success: true,
      message: "new post created",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
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
      status,
      courseId,
      ingredients,
      categories,
    } = req.body;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access: You are not allowed to update this post",
      });
    }

    const postUpdate = await postModel.findByIdAndUpdate(postId, {
      userId: req.user._id,
      title,
      mediaTitle,
      description,
      ration,
      level,
      intendTime,
      steps,
      status,
      courseId,
    });

    // Xóa các bản ghi thành phần nguyên liệu và danh mục cũ
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
        await postIngredient.save(); // Lưu bản ghi của thành phần nguyên liệu
      } catch (error) {
        console.error("Error updating post ingredient:", error);
        // Xử lý lỗi nếu cần
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
        // Xử lý lỗi nếu cần
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
      message: "Error in Registration",
      error,
    });
  }
};

// get all post
const getAllPost = async (req, res) => {
  try {
    const posts = await postModel
      .find({ courseId: null })
      .sort({ createAt: -1 })
      .select("_id title mediaTitle level intendTime likeCount");
    for (let i = 0; i < posts.length; i++) {
      const categories = await postCategoryModel
        .find({ postId: posts[i]._id })
        .populate("categoryId", "name");

      // posts[i].set({ categories: categories });
    }
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
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access: You are not allowed to update this post",
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
      message: "error while deleting category",
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
