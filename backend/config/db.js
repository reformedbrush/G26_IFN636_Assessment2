const dns = require("dns");
const mongoose = require("mongoose");

// Prefer IPv4 on Windows; avoids querySrv ECONNREFUSED with some DNS setups
dns.setDefaultResultOrder("ipv4first");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MongoDB connection error: MONGO_URI is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
