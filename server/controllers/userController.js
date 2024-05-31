// controllers/userController.js

const userModel = require("../models/userModel");
const roleChangeRequestModel = require("../models/roleChangeRequestModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({
      role: { $ne: "admin" },
      status: { $ne: "disabled" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const user = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findByIdAndUpdate(userId, {
      status: "disabled",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const requestRoleChange = async (req, res) => {
  try {
    const { phone, roleRequestReason } = req.body;

    const existingRequest = await roleChangeRequestModel.findOne({
      userId: req.user._id,
      status: "waiting",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Role change request already pending" });
    }

    const newRequest = new roleChangeRequestModel({
      userId: req.user._id,
      phone,
      roleRequestReason,
    });

    await newRequest.save();
    res.json({ message: "Role change request submitted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getLatestRequestStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const latestRequest = await roleChangeRequestModel
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!latestRequest) {
      return res.status(404).json({ message: "No role change request found" });
    }

    res.json({ status: latestRequest.status });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRequest = async (req, res) => {
  try {
    const allRequest = await roleChangeRequestModel
      .find({ status: "waiting" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (!allRequest) {
      return res.status(404).json({ message: "No role change request found" });
    }

    res.json({ message: "Get all request succes", allRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const approveRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await roleChangeRequestModel.findById(requestId);
    if (!request || request.status !== "waiting") {
      return res
        .status(404)
        .json({ message: "Request not found or already processed" });
    }

    const user = await userModel.findById(request.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role to "chef"
    user.role = "chef";
    await user.save();

    // Update the request status to "approved"
    request.status = "approved";
    await request.save();

    res.json({ message: "Role change request approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await roleChangeRequestModel.findById(requestId);
    if (!request || request.status !== "waiting") {
      return res
        .status(404)
        .json({ message: "Request not found or already processed" });
    }

    // Update the request status to "rejected"
    request.status = "rejected";
    await request.save();

    res.json({ message: "Role change request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  requestRoleChange,
  getLatestRequestStatus,
  getAllRequest,
  approveRequest,
  rejectRequest,
};
