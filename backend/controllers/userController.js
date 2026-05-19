const User = require("../models/User");

// GET /api/users/profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
