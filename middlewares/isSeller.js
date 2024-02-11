const jwt = require("jsonwebtoken");

const isSeller = (req, res, next) => {
  // Extract the token from the request headers or cookies
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Token not provided." });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }

    if ( decoded?.userRole === "Seller") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access forbidden. User must be a seller." });
    }
  });
};

module.exports = isSeller;
