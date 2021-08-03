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
  // TODO: Read username, pwd from the req object
  // Check if data is valid
  // Return correct status codes: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  // If the user is verified, then return a token along with correct status code
};

const signup = async (req, res) => {
  // TODO: Read username, email, name, pwd from the req object
  // Hash the password
  // Return with appropriate status code in case of an error
  // If successful, return with an appropriate token along with correct status code
  console.log(req.body);
  const body = req.body;
  if(!(body.email && body.password && body.name && body.username)) {
    return res.status(400).send({error: "Missing required fields"});
  }

  const user = new User(body);

  bcrypt.genSalt(10).then(salt=>{
    bcrypt.hash(user.password,salt).then(hashedPassword =>{
      user.password = hashedPassword;
      user.save().then(user=>{
        createToken(user).save().then(tokenObject=>{
          res.status(200).json({token:tokenObject.token});
        })
      })
    })
  })

};

const profile = async (req, res) => {
  // TODO:
  // Implement the functionality to retrieve the details
  // of the logged in user.
  // Check for the token and then use it to get user details
};

module.exports = { login, signup, profile };
