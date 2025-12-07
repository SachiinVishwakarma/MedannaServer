const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
