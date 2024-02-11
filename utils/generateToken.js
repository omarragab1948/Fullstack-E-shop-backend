const { sign } = require("jsonwebtoken");

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET_KEY;
  const token = sign({ userId: id, userRole: role }, secret, {
    expiresIn: "1d",
  });
  return token;
};
module.exports = generateToken;
