const { User, Token } = require("../models");
const { randomBytes } = require("crypto");
const bcrypt = require("bcrypt");
const BackendError = require("../utils/BackendError");

const createToken = (user) => {
  return new Token({
    user: user._id,
    token: randomBytes(40).toString("hex"),
  });
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (username == null) throw new BackendError(400, "Username is required");
    if (!username) throw new BackendError(400, "Username cannot be blank");
    if (password == null) throw new BackendError(400, "Password is required");
    if (!password) throw new BackendError(400, "Password cannot be blank");
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password).catch(next);
    if (!result) {
      throw new BackendError(400, "Either username or password is incorrect");
    }
    const token = await Token.findOne({ user: user._id });
    return res.status(200).json({ token: token.token });
  } catch (err) {
    next(err);
  }
};

const signup = async (req, res, next) => {
  try {
    const { username, email, name, password } = req.body;
    if (username == null) throw new BackendError(400, "Username is required");
    if (!username) throw new BackendError(400, "Username cannot be blank");
    if (password == null) throw new BackendError(400, "Password is required");
    if (!password) throw new BackendError(400, "Password cannot be blank");
    if (email == null) throw new BackendError(400, "Email is required");
    if (!email) throw new BackendError(400, "Email cannot be blank");
    if (name == null) throw new BackendError(400, "Name is required");
    if (!name) throw new BackendError(400, "Name cannot be blank");
    const hash = await bcrypt.hash(password, 14).catch(next);
    const user = new User({ username, email, name, password: hash });
    await user.save();
    const token = createToken(user);
    await token.save();
    return res.status(200).json({ token: token.token });
  } catch (err) {
    next(err);
  }
};

const profile = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { login, signup, profile };
