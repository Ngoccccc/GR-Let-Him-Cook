const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware.js");
const {
  momoPayment,
  momoResponse,
  checkTransactions,
} = require("../controllers/paymentController.js");

const {
  zaloPayment,
  zalopayResponse,
} = require("../controllers/zalopaymentController");
//router object
const router = express.Router();

//routes

router.post("/", momoPayment);
router.post("/momo-response", momoResponse);
router.post("/check-transaction", checkTransactions);
router.post("/zalopay", zaloPayment);
router.post("/zalopay-response", zalopayResponse);
module.exports = router;
