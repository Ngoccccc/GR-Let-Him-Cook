// routes/user.js

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
  requestRoleChange,
  getLatestRequestStatus,
  getAllRequest,
  approveRequest,
  rejectRequest,
} = require("../controllers/userController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

router.get("/users", requireSignIn, isAdmin, getAllUsers);
router.put("/users/:id", requireSignIn, isAdmin, updateUser);
router.delete("/delete-user/:id", requireSignIn, isAdmin, deleteUser);
router.post("/request-role-change", requireSignIn, requestRoleChange);
router.get("/get-request-status", requireSignIn, getLatestRequestStatus);
router.get("/get-all-request", requireSignIn, isAdmin, getAllRequest);
router.put("/approve-request/:id", requireSignIn, isAdmin, approveRequest);
router.put("/reject-request/:id", requireSignIn, isAdmin, rejectRequest);
module.exports = router;
