const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const Url = process.env.MONGODB_URI;

    await mongoose.connect(Url);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;
