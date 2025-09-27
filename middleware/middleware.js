const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlackListing");

const errorResponse = (functionName, e) => ({
  status: "FAILURE",
  message: `Issue in ${functionName} function`,
  error: e.message
});

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token missing" });
  }

  const blacklisted = await TokenBlacklist.findOne({ token });
  if (blacklisted) {
    return res.status(401).json({ message: "Unauthorized - Token blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Token invalid" });
  }
};

module.exports = {errorResponse , authMiddleware};