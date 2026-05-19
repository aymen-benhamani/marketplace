const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  deliveryPrice: Number,
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: {
    type: String,
    required: true,
    match: [/^(\\+212|0)[5-7][0-9]{8}$/, "Numéro de téléphone invalide"]
  }
    },
    productsTotal: { type: Number, required: true },
    deliveryTotal: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
