const asyncWrapper = require("../middlewares/asyncWrapper");
const Product = require("../models/productsModel");
const connectDB = require("../DB/connectDB");
const verifyToken = require("../utils/verifyToken");

const sellProduct = asyncWrapper(async (req, res) => {
  const {
    title,
    price,
    category,
    colors,
    specifications,
    description,
    images,
  } = req.body;
  const userId = await verifyToken(req.cookies.token);
  // Check if required fields are provided
  if (!title || !price || !category || !description || !images) {
    return res.status(400).json({
      message: "Title, price, category, description, and images are required.",
    });
  }

  try {
    // Connect to the database
    connectDB();

    // Create a new product
    const newProduct = await Product.create({
      title,
      price,
      category,
      colors,
      specifications,
      description,
      images,
      userId,
    });

    res
      .status(201)
      .json({ message: "Product added successfully.", data: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
const getProducts = asyncWrapper(async (req, res) => {
  const { status, search } = req.query;
  connectDB();
  const userId = await verifyToken(req.cookies.token);
  console.log(status, search);
  try {
    let products;
    if (status) {
      if (search) {
        products = await Product.find({
          userId,
          status,
          title: { $regex: new RegExp(search, "i") },
        }).select("-password -__v");
      } else {
        products = await Product.find({ status }).select("-password -__v");
      }
    } else {
      products = await Product.find().select("-password -__v");
    }

    res.status(200).json({
      data: { products: products },
      message: products.length > 0 ? "Success" : "You dson't have products",
    });
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
});
module.exports = {
  sellProduct,
  getProducts,
};
