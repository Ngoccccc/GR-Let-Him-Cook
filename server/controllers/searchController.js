const postModel = require("../models/postModel.js");
const postCategoryModel = require("../models/postCategoryModel.js");
const postIngredientModel = require("../models/postIngredientModel.js");
const likeModel = require("../models/likeModel.js");
const categoryModel = require("../models/categoryModel.js");
const userHaveCourseModel = require("../models/userHaveCourseModel.js");
const ingredientModel = require("../models/ingredientModel.js");
const courseModel = require("../models/courseModel.js");
const Fuse = require("fuse.js");
const searchGlobal = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user?._id;
    let allPost = await postModel
      .find({ courseId: null, status: "published" })
      .lean();
    let allIngredient = await ingredientModel.find({}).lean();
    let allCategory = await categoryModel.find({}).lean();
    let allCourse = await courseModel
      .find({})
      .populate("userId", "name")
      .lean();

    if (userId) {
      // Tìm các khóa học mà người dùng đã tham gia
      const userHaveCourse = await userHaveCourseModel
        .find({ userId: userId })
        .lean();
      const userHaveCourseId = userHaveCourse.map((item) =>
        item.courseId.toString()
      );

      // Lọc các khóa học mà người dùng chưa tham gia
      allCourse = allCourse.filter(
        (course) => !userHaveCourseId.includes(course._id.toString())
      );

      // Tìm các bài đăng mà người dùng đã thích
      const likedPost = await likeModel.find({ userId }).lean();
      const likedPostId = likedPost.map((item) => item.postId.toString());

      // Lọc các bài đăng mà người dùng chưa thích
      allPost = allPost.filter(
        (post) => !likedPostId.includes(post._id.toString())
      );
    }

    const fusePost = new Fuse(allPost, {
      keys: ["title", "description", "ration", "level"],
    });

    const fuseCategory = new Fuse(allCategory, {
      keys: ["name", "slug"],
    });

    const fuseIngredient = new Fuse(allIngredient, {
      keys: ["name", "slug"],
    });
    const fuseCourse = new Fuse(allCourse, {
      keys: ["name", "description"],
    });
    const resultPost = fusePost.search(search);
    const resultCategory = fuseCategory.search(search);
    const resultIngredient = fuseIngredient.search(search);
    const resultCourse = fuseCourse.search(search);
    // Lưu trữ danh sách ID theo thứ tự từ Fuse.js
    const ingredientIds = resultIngredient.map((item) =>
      item.item._id.toString()
    );
    const categoryIds = resultCategory.map((item) => item.item._id.toString());
    const postIngredients = await postIngredientModel
      .find({
        ingredientId: { $in: ingredientIds },
      })
      .lean();
    const postCategories = await postCategoryModel
      .find({
        categoryId: { $in: categoryIds },
      })
      .lean();

    const sortedPostIngredients = postIngredients.sort((a, b) => {
      return (
        ingredientIds.indexOf(a.ingredientId.toString()) -
        ingredientIds.indexOf(b.ingredientId.toString())
      );
    });

    const sortedPostCategories = postCategories.sort((a, b) => {
      return (
        categoryIds.indexOf(a.categoryId.toString()) -
        categoryIds.indexOf(b.categoryId.toString())
      );
    });

    const combinedPostIds = [
      ...resultPost.map((item) => item.item._id.toString()),
      ...sortedPostCategories.map((item) => item.postId.toString()),
      ...sortedPostIngredients.map((item) => item.postId.toString()),
    ];

    const uniquePostIds = [...new Set(combinedPostIds)];

    const suggestPosts = await postModel
      .find({
        _id: { $in: uniquePostIds },
        courseId: null,
        status: "published",
      })
      .select("_id title mediaTitle level intendTime likeCount")
      .lean();
    suggestPosts.sort((a, b) => {
      return (
        uniquePostIds.indexOf(a._id.toString()) -
        uniquePostIds.indexOf(b._id.toString())
      );
    });

    return res.status(200).json({
      suggestPosts,
      suggestCategories: resultCategory.map((category) => category.item),
      suggestCourses: resultCourse.map((course) => course.item),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { searchGlobal };
