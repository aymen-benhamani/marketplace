const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/admin");

const {
  getPendingSellers,
  getUsers,
  approveSeller,
  rejectSeller,
} = require("../controllers/adminController");

router.get("/sellers/pending", protect, adminOnly, getPendingSellers);
router.get("/users", protect, adminOnly, getUsers);
router.patch("/sellers/:id/approve", protect, adminOnly, approveSeller);
router.patch("/sellers/:id/reject", protect, adminOnly, rejectSeller);

module.exports = router;