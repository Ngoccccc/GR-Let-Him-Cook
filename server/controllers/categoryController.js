const categoryModel = require("../models/categoryModel.js");
const postCategoryModel = require("../models/postCategoryModel.js");
const slugify = require("slugify");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({
      slug: slugify(name),
    });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exist",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created",
      category,
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
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// get all category for user
const getAllCategory = async (req, res) => {
  try {
    const categories = await postCategoryModel.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "postId",
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
        },
      },
      {
        $group: {
          _id: "$categoryId",
          postCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          name: "$category.name",
          slug: "$category.slug",
          postCount: 1,
        },
      },
      {
        $sort: { postCount: -1 },
      },
    ]);

    console.log(categories);
    return res.status(200).send({
      success: true,
      message: "Get all categories successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories with post count:", error);
    return res.status(500).send({
      success: false,
      message: "Error while fetching categories",
      error,
    });
  }
};

// get all categories for admin
const getAllCategoriesForAdmin = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
const getSingleCategory = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    // Xoá category
    await categoryModel.findByIdAndDelete(id);
    await postCategoryModel.deleteMany({ categoryId: id });
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
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
  createCategory,
  updateCategory,
  getAllCategory,
  getSingleCategory,
  deleteCategory,
  getAllCategoriesForAdmin,
};
