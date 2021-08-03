const Token = require("../models/token");
const BackendError = require("../utils/BackendError");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !/^Token /.test(authHeader))
      throw new BackendError(401, "Authorization header is missing");
    const tokenString = authHeader.slice(6);
    const token = await Token.findOne({ token: tokenString }).populate(
      "user",
      "_id name username email"
    );
    if (!token) throw new BackendError(401, "Invalid token");
    req.user = token.user;
    next();
  } catch (err) {
    next(err);
  }
};
