const Product = require("../models/Product");

// GET /api/products?search=&category=
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate("seller", "name email");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products (seller only)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      deliveryPrice,
      deliveryTime,
    } = req.body;

    // VALIDATIONS
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "Invalid stock" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      deliveryPrice,
      deliveryTime,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      seller: req.user._id,
      sold: 0,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:id (SECURE UPDATE)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // SECURITY CHECK
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // SAFE UPDATE (NO req.body DIRECT)
    const updatedData = {};

    if (req.body.name) updatedData.name = req.body.name;
    if (req.body.description) updatedData.description = req.body.description;
    if (req.body.price !== undefined) {
      if (req.body.price <= 0) {
        return res.status(400).json({ message: "Invalid price" });
      }
      updatedData.price = req.body.price;
    }

    if (req.body.category) updatedData.category = req.body.category;
    if (req.body.stock !== undefined) {
      if (req.body.stock < 0) {
        return res.status(400).json({ message: "Invalid stock" });
      }
      updatedData.stock = req.body.stock;
    }

    if (req.body.deliveryPrice) updatedData.deliveryPrice = req.body.deliveryPrice;
    if (req.body.deliveryTime) updatedData.deliveryTime = req.body.deliveryTime;

    // IMAGE UPDATE
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/my
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/popular?limit=8
const getPopularProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ sold: { $gt: 0 } })
      .sort({ sold: -1 })
      .limit(limit)
      .populate("seller", "name email");

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getPopularProducts,
};