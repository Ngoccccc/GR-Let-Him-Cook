const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

//Protected Routes token base
const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    req.user = decode;
    const user = await userModel.findById(req.user._id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    let user = decode;
    user = await userModel.findById(user._id);
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

//admin access
const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

const isChef = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "chef") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
const assignRole = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decode = JWT.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decode._id);

      if (user) {
        req.user = {
          _id: user._id,
          role: user.role,
          name: user.name,
        };
      } else {
        req.user = {
          role: "guest",
        };
      }
    } else {
      req.user = {
        role: "guest",
      };
    }

    next();
  } catch (error) {
    console.error("Error in assignRole middleware:", error);
    res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
};
module.exports = { requireSignIn, requireAdmin, isAdmin, isChef, assignRole };
