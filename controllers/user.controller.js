const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/userModel");
const connectDB = require("../DB/connectDB");
const verifyToken = require("../utils/verifyToken");
const Product = require("../models/productsModel");
const bcrypt = require("bcryptjs");

const getUserInfo = asyncWrapper(async (req, res) => {
  const token = req.cookies.token;
  const userId = await verifyToken(token);
  if (userId) {
    connectDB();
    try {
      const existUser = await User.findById(userId).select("-password -__v");
      res.status(200).json({ data: { user: existUser } });
    } catch (err) {
      res.status(500).json({ message: "User dosn't exist" });
    }
  } else {
    const error = new Error();
    error.status = 404;
    error.message = "User id is incorrect";
    next(error);
  }
});
const editUserInfo = asyncWrapper(async (req, res) => {
  const token = req.cookies.token;
  const { userName, email, role } = req.body;
  const userId = await verifyToken(token);
  if (userId) {
    connectDB();
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, {
        userName,
        email,
        role: role === "User" ? role : "Pending",
      });
      res
        .status(200)
        .json({ message: "User information updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "User dosn't exist" });
    }
  } else {
    const error = new Error();
    error.status = 404;
    error.message = "User id is incorrect";
    next(error);
  }
});
const getUsers = asyncWrapper(async (req, res) => {
  const { role, search } = req.query;
  connectDB();

  try {
    let existUsers;
    if (role) {
      if (search) {
        existUsers = await User.find({
          role,
          userName: { $regex: new RegExp(search, "i") },
        }).select("-password -__v");
      } else {
        existUsers = await User.find({ role }).select("-password -__v");
      }
    } else {
      existUsers = await User.find().select("-password -__v");
    }

    res.status(200).json({ data: { users: existUsers } });
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
});

const acceptUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.query;
  console.log(id);
  if (id) {
    connectDB();
    try {
      const updatedUser = await User.findByIdAndUpdate(id, {
        role: "Seller",
      });
      res.status(200).json({ message: "User accepted successfully" });
    } catch (err) {
      res.status(500).json({ message: "User dosn't exist" });
    }
  } else {
    const error = new Error();
    error.status = 404;
    error.message = "User id is incorrect";
    next(error);
  }
});
const rejectUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.query;
  if (id) {
    connectDB();
    try {
      const updatedUser = await User.findByIdAndUpdate(id, {
        role: "User",
      });
      res.status(200).json({ message: "User rejected successfully" });
    } catch (err) {
      res.status(500).json({ message: "User dosn't exist" });
    }
  } else {
    const error = new Error();
    error.status = 404;
    error.message = "User id is incorrect";
    next(error);
  }
});
const getUserInfoForAdmin = asyncWrapper(async (req, res, next) => {
  const { id } = req.query;
  if (id) {
    connectDB();
    try {
      const existUser = await User.findById(id).select("-password -__v");
      const userProducts = await Product.find({ userId: id });
      console.log(userProducts);
      res
        .status(200)
        .json({ data: { user: existUser, products: userProducts } });
    } catch (err) {
      res.status(500).json({ message: "User dosn't exist" });
    }
  } else {
    const error = new Error();
    error.status = 404;
    error.message = "User id is incorrect";
    next(error);
  }
});
module.exports = {
  getUserInfo,
  editUserInfo,
  getUsers,
  acceptUser,
  rejectUser,
  getUserInfoForAdmin,
};
