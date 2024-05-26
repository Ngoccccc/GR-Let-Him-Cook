const ingredientModel = require("../models/ingredientModel.js");
const slugify = require("slugify");

const createIngredient = async (req, res) => {
    try {
        const { name, unit } = req.body;
        if (!name) {
            return res.status(401).send({ message: "Name is required" });
        }
        if (!unit) {
            return res.status(401).send({ message: "Unit is required" });
        }
        const existingIngredient = await ingredientModel.findOne({ slug: slugify(name) });
        if (existingIngredient) {
            return res.status(200).send({
                success: false,
                message: "Ingredient Already Exist",
            });
        }
        const ingredient = await new ingredientModel({
            name,
            slug: slugify(name),
            unit,
        }).save();
        res.status(201).send({
            success: true,
            message: "new ingredient created",
            ingredient,
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
//update ingredient
const updateIngredient = async (req, res) => {
    try {
        const { name, unit } = req.body;
        const { id } = req.params;
        const ingredient = await ingredientModel.findByIdAndUpdate(
            id,
            { name, unit, slug: slugify(name) },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Ingredient Updated Successfully",
            ingredient,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating ingredient",
        });
    }
};

// get all ingredient
const getAllIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientModel.find({});
        res.status(200).send({
            success: true,
            message: "All Categories List",
            ingredient,
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

// single ingredient
const getSingleIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientModel.findOne({ slug: req.params.slug });
        res.status(200).send({
            success: true,
            message: "Get SIngle Ingredient SUccessfully",
            ingredient,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While getting Single Ingredient",
        });
    }
};

//delete ingredient
const deleteIngredient = async (req, res) => {
    try {
        const { id } = req.params;
        const ingredient = await ingredientModel.findById(id);
        // Xoá ingredient
        await ingredientModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Ingredient Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while deleting ingredient",
            error,
        });
    }
};

module.exports = { createIngredient, updateIngredient, getAllIngredient, getSingleIngredient, deleteIngredient };