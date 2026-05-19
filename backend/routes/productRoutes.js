const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getPopularProducts,
} = require("../controllers/productController");

const { protect, sellerOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getProducts);
router.get("/popular", getPopularProducts); 
router.get("/my", protect, sellerOnly, getMyProducts);
router.get("/:id", getProduct);

router.post("/", protect, sellerOnly, upload.single("image"), createProduct);

router.put("/:id", protect, sellerOnly, updateProduct);
router.delete("/:id", protect, sellerOnly, deleteProduct);

module.exports = router;