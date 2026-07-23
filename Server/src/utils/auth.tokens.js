const jwt = require("jsonwebtoken");

function generateToken(payload) {
    console.log(process.env.JWT_SECRET)
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

module.exports = generateToken;
