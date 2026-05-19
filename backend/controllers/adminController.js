const User = require("../models/User");

// GET pending sellers
const getPendingSellers = async (req, res) => {
  try {
    const users = await User.find({
      role: "seller",
      sellerStatus: "pending",
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve seller
const approveSeller = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { sellerStatus: "approved" },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject seller
const rejectSeller = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { sellerStatus: "rejected" },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPendingSellers,
  getUsers,
  approveSeller,
  rejectSeller,
};