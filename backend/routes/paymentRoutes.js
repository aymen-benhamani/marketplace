const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Stripe (fake)
router.post("/stripe/create-intent", protect, async (req, res) => {
  const { amount } = req.body;
  res.json({ clientSecret: "demo_secret_" + amount });
});

// PayPal (fake)
router.post("/paypal/create-order", protect, async (req, res) => {
  res.json({ orderID: "demo_order_" + Date.now() });
});

router.post("/paypal/capture/:id", protect, async (req, res) => {
  res.json({ success: true });
});

module.exports = router;