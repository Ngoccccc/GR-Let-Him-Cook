const express = require("express");
const {
  registerController,
  loginController,
  forgotPasswordController,
} = require("../controllers/authController.js");

const {
  requireSignIn,
  requireAdmin,
} = require("../middlewares/authMiddleware.js");
//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/admin-auth", requireAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

module.exports = router;
