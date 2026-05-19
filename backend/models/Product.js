const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: "general" },
    stock: { type: Number, default: 0, min: 0 },
    deliveryPrice: { type: Number, default: 0 },
    deliveryTime: { type: String, default: "2-3 days" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, default: "" },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
