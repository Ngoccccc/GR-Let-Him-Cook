const express = require('express');
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware.js")
const {
    createIngredient,
    updateIngredient,
    getAllIngredient,
    getSingleIngredient,
    deleteIngredient
} = require("../controllers/ingredientController.js");

//router object
const router = express.Router();

//routes

//getALl ingredient
router.get("/get-ingredient", getAllIngredient);

//single ingredient
router.get("/single-ingredient/:slug", getSingleIngredient);

// create ingredient
router.post(
    "/create-ingredient",
    requireSignIn,
    isAdmin,
    createIngredient
);

//update ingredient
router.put(
    "/update-ingredient/:id",
    requireSignIn,
    isAdmin,
    updateIngredient
);

//delete ingredient
router.delete(
    "/delete-ingredient/:id",
    requireSignIn,
    isAdmin,
    deleteIngredient
);

module.exports = router