const { User, Token } = require("../models");
const { randomBytes } = require("crypto");
const bcrypt = require("bcrypt");

const createToken = (user) => {
  return Token({
    user: user._id,
    token: randomBytes(40).toString("hex"),
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send('User fields are empty!');
  } else {
    const user = await User.findOne({ username: username });
    if (user) {
      const validPass = await bcrypt.compare(password, user.password);

      if (validPass) {
        const token = await Token.findOne({ user: user._id });
        res.status(200).json({ token: token.token });
      } else {
        res.status(401).send('Wrong password!'); 
      }
    } else {
      res.status(404).send('User not found!');
    }
  }
};

const signup = async (req, res) => {
  const { username, email, name, password } = req.body;

  if (!username || !email || !name || !password) {
    res.status(400).send('User fields cannot be empty!');
  } else {
    const hash = await bcrypt.hash(password, 10);
    
    const user = new User({
      name: name,
      email: email,
      username: username,
      password: hash
    })
    await user.save();

    const token = createToken(user);
    await token.save();

    res.status(200).json({ token: token.token });
  }
};

const profile = async (req, res) => {
  const { id, name, email, username } = req.user;
  res.status(200).json({ id: id, name: name, email: email, username: username }); 
};

module.exports = { login, signup, profile };
