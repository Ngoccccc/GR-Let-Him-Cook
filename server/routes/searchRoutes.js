const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware.js");
const { searchGlobal } = require("../controllers/searchController.js");

//router object
const router = express.Router();

//routes

router.get("/search-global", searchGlobal);
module.exports = router;
