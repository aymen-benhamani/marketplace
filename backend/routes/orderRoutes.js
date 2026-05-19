const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, sellerOnly } = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/seller", protect, sellerOnly, getSellerOrders); 
router.get("/:id", protect, getOrder);
router.patch("/:id/status", protect, sellerOnly, updateOrderStatus);

module.exports = router;