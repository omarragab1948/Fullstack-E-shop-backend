const { verify } = require("jsonwebtoken");

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET_KEY;
  try {
    const decoded = verify(token, secret);
    return decoded.userId;
  } catch (err) {
    return err;
  }
};
module.exports = verifyToken;
