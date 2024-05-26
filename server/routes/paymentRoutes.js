const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware.js");
const {
  momoPayment,
  momoResponse,
  checkTransactions,
} = require("../controllers/paymentController.js");

//router object
const router = express.Router();

//routes

router.post("/", momoPayment);
router.post("/momo-response", momoResponse);
router.post("/check-transaction", checkTransactions);

module.exports = router;
