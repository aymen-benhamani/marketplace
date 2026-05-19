const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // On recharge le user depuis la DB pour avoir le sellerStatus à jour
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

const sellerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({ message: "Seller access only" });
  }

  if (req.user.sellerStatus !== "approved") {
    return res.status(403).json({
      message:
        req.user.sellerStatus === "pending"
          ? "Votre compte vendeur est en attente d'approbation par un administrateur."
          : "Votre compte vendeur a été rejeté. Contactez le support.",
    });
  }

  next();
};

module.exports = { protect, sellerOnly };