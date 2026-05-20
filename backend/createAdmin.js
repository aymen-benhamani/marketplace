const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOneAndUpdate(
    { email: "admin@marketplace.com" },
    {
      name: "Admin",
      email: "admin@marketplace.com",
      password: "admin123456",  
      role: "admin",
      sellerStatus: "approved",
    },
    { upsert: true, new: true }
  );

  console.log("✅ Admin créé:", admin.email);
  process.exit();
}

createAdmin();