const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware.js");
const {
  createCategory,
  updateCategory,
  getAllCategory,
  getSingleCategory,
  deleteCategory,
  getAllCategoriesForAdmin,
} = require("../controllers/categoryController.js");

//router object
const router = express.Router();

//routes

//getALl category
router.get("/get-all-category", getAllCategory);
router.get("/get-all-category-admin", getAllCategoriesForAdmin);

//single category
router.get("/single-category/:slug", getSingleCategory);

// create category
router.post("/create-category", requireSignIn, isAdmin, createCategory);

//update category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategory);

//delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);

module.exports = router;
