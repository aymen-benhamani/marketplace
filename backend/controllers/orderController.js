const Order = require("../models/Order");
const Product = require("../models/Product");

// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Vérification du stock AVANT création commande
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: "Produit introuvable" });
      if (item.quantity <= 0) return res.status(400).json({ message: "Quantité invalide" });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
    }

    // Calcul des totaux
    const productsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryTotal = items.reduce((sum, item) => sum + (item.deliveryPrice || 0), 0);
    const total = productsTotal + deliveryTotal;

    // Création commande
    const order = await Order.create({
      buyer: req.user._id,
      items,
      shippingAddress,
      productsTotal,
      deliveryTotal,
      total,
    });

    // Mise à jour stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("placeOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("items.product", "name image")
      .sort("-createdAt");
    res.json(orders);
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/seller
const getSellerOrders = async (req, res) => {
  try {
    const myProducts = await Product.find({ seller: req.user._id }).select("_id").lean();
    const myProductIds = myProducts.map((p) => p._id.toString());

    if (myProductIds.length === 0) return res.json([]);

    const orders = await Order.find({ "items.product": { $in: myProductIds } })
      .populate("buyer", "name email")
      .populate("items.product", "name image price")
      .sort("-createdAt")
      .lean();

    const sellerOrders = orders.map((order) => {
      const filteredItems = (order.items || []).filter((item) => {
        if (!item || !item.product) return false;
        const pid = item.product._id ? item.product._id.toString() : item.product.toString();
        return myProductIds.includes(pid);
      });

      const sellerTotal = filteredItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      return { ...order, items: filteredItems, sellerTotal };
    });

    res.json(sellerOrders);
  } catch (err) {
    console.error("❌ getSellerOrders error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name image price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.buyer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    res.json(order);
  } catch (err) {
    console.error("getOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log("🔄 updateOrderStatus called, status:", status);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    console.log("📦 order.status actuel:", order.status);
    console.log("📦 order.items:", JSON.stringify(order.items, null, 2));

    const previousStatus = order.status;

    if (status === "cancelled" && previousStatus !== "cancelled") {
      console.log("🔁 Annulation détectée — remise du stock");
      for (const item of order.items) {
        console.log("🔍 item.product:", item.product, "qty:", item.quantity);
        const product = await Product.findById(item.product);
        console.log("📦 product trouvé:", product ? product.name : "NULL");
        if (product) {
          product.stock += item.quantity;
          product.sold = Math.max(0, (product.sold || 0) - item.quantity);
          await product.save();
          console.log(`✅ Stock remis: ${product.name} → stock=${product.stock}`);
        }
      }
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  getOrder,
  updateOrderStatus,
};