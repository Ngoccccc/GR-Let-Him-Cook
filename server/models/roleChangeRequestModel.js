// models/RoleChangeRequest.js

const mongoose = require("mongoose");

const RoleChangeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  roleRequestReason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "approved", "rejected"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RoleChangeRequest = mongoose.model(
  "RoleChangeRequest",
  RoleChangeRequestSchema
);
module.exports = RoleChangeRequest;
