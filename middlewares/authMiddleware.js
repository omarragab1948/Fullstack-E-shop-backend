// authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import your user model
const connectDB = require("../DB/connectDB");

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/signin"); // Redirect to login page or handle as needed
      } else {
        next();
      }
    });
  } else {
    res.redirect("/signin"); // Redirect to login page or handle as needed
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  // Check if token exists
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/signin"); // Redirect to login page or handle as needed
      } else {
        connectDB();
        const user = await User.findById(decodedToken.userId);

        if (user && user.role === "Admin") {
          next();
        } else {
          res.redirect("/signin"); // Redirect to login page or handle as needed
        }
      }
    });
  } else {
    res.redirect("/signin"); // Redirect to login page or handle as needed
  }
};

module.exports = { requireAuth, isAdmin };
