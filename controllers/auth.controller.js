const connectDB = require("../DB/connectDB");
const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const signUp = asyncWrapper(async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (userName && email && password) {
    connectDB();
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      const error = new Error();
      error.status = 400;
      error.message = "User already exists";
      next(error);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        userName,
        email,
        password: hashedPassword,
      };
      try {
        const user = await User.create(newUser);
        if (user) {
          res
            .status(201)
            .json({ status: "success", message: "User created successfully" });
        } else {
          const error = new Error();
          error.status = 400;
          error.message = "Failed to create user";
          next(error);
        }
      } catch (err) {
        if (err.errors.email) {
          res
            .status(400)
            .json({ status: "failed", message: err.errors.email.message });
        } else if (err.errors.password) {
          res
            .status(400)
            .json({ status: "failed", message: err.errors.password.message });
        }
      }
    }
  } else {
    const error = new Error();
    error.status = 400;
    error.message = "Missing required fields";
    next(error);
  }
});

const signIn = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  connectDB();

  if (email && password) {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        const verifiedPassword = await bcrypt.compare(password, user.password);
        if (verifiedPassword) {
          const token = generateToken(user?._id.toString(), user?.role);
          res.cookie("token", token, {
            httpOnly: true,
          });
          res.status(200).json({
            status: "success",
            data: { user: user.userName, role: user.role, token },
          });
        } else {
          const error = new Error();
          error.status = 400;
          error.message = "password is incorrect";
          next(error);
        }
      } else {
        const error = new Error();
        error.status = 400;
        error.message = "User dosn't exist";
        next(error);
      }
    } catch (err) {
      res
        .status(400)
        .json({ status: "failed", message: err.errors.email.message });
    }
  } else {
    const error = new Error();
    error.status = 400;
    error.message = "Missing required fields";
    next(error);
  }
});
const signOut = asyncWrapper(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "signed out",
  });
});
module.exports = {
  signUp,
  signIn,
  signOut,
};
