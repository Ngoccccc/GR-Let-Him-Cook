const ingredientModel = require("../models/ingredientModel.js");
const fs = require("fs");
const slugify = require("slugify");
const postIngredientModel = require("../models/postIngredientModel.js");
const createIngredient = async (req, res) => {
  try {
    const { name, unit } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    if (!unit) {
      return res.status(401).send({ message: "Unit is required" });
    }
    const existingIngredient = await ingredientModel.findOne({
      slug: slugify(name),
    });
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
    await postIngredientModel.deleteMany({ ingredientId: id });
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

const importIngredientsFromJSON = async (req, res) => {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(
      "D:/HK2023.2/Doan_Cooking_Guide/server/utils/newIngredients.json"
    );
    const data = JSON.parse(rawData);
    console.log(data);
    // Kiểm tra xem có dữ liệu hay không
    if (!data || !data.meals || data.meals.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data to create" });
    }

    const meals = data.meals;

    // Lặp qua từng nguyên liệu để tạo mới trong cơ sở dữ liệu
    for (let i = 0; i < meals.length; i++) {
      const { strIngredient, unit } = meals[i];

      // Kiểm tra xem nguyên liệu đã tồn tại hay chưa
      const existingIngredient = await ingredientModel.findOne({
        name: strIngredient,
      });

      // Nếu chưa tồn tại, thêm vào cơ sở dữ liệu
      if (!existingIngredient) {
        const newIngredient = new ingredientModel({
          name: strIngredient,
          slug: slugify(strIngredient),
          unit: unit ? unit : "Đơn vị mặc định", // Đơn vị mặc định nếu không có đơn vị trong dữ liệu
        });
        await newIngredient.save();
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Ingredients created successfully" });
  } catch (error) {
    console.error("Error while creating ingredients:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

module.exports = {
  createIngredient,
  updateIngredient,
  getAllIngredient,
  getSingleIngredient,
  deleteIngredient,
  importIngredientsFromJSON,
};
