const { User, Token } = require("../models");
const { randomBytes } = require("crypto");
const { validate } = require("../utils");
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
  const body = req.body;
  if (!(body.username && body.password)) {
    return res.status(400).send({error: "Missing required fields"});
  }
  User.findOne({'username':body.username},'_id password',async (err,user)=>{
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (user == null){
      return res.status(401).json({error:"Invalid username or password"});
    }
    const match = await bcrypt.compare(body.password,user.password);
    if (match) {
      Token.findOne({user:user.id},(err,token)=>{
        res.status(200).json({token:token.token});
      })
    }
    else {
      res.status(401).json({error:"Invalid username or password"});
    }
  });

};

const signup = async (req, res) => {
  // TODO: Read username, email, name, pwd from the req object
  // Hash the password
  // Return with appropriate status code in case of an error
  // If successful, return with an appropriate token along with correct status code
  const body = req.body;
  if(!(body.email && body.password && body.name && body.username)) {
    return res.status(400).send({error: "Missing required fields"});
  }
  if (!validate.isValidEmail(body.email)) {
    return res.status(400).send({error:"Invalid Email"});
  }
  if (!validate.isValidUsername(body.username)) {
    return res.status(400).send({error:"Invalid Username"});
  }
  if (!validate.isValidPassword(body.password)) {
    return res.status(400).send({error:"Invalid Password"});
  }
  if (!validate.isValidName(body.name)) {
    return res.status(400).send({error: "Invalid Name"});
  }

  const user = new User(body);
  bcrypt.genSalt(10).then(salt=>{
    bcrypt.hash(user.password,salt).then(hashedPassword =>{
      user.password = hashedPassword;
      user.save().then(user=>{
        createToken(user).save().then(tokenObject=>{
          res.status(200).json({token:tokenObject.token});
        })
      }).catch(err=>{
       if (err.errors.username && err.errors.username.kind=='unique') {
         return res.status(409).json({
           error: "username already in use"
         });
       }
       if (err.errors.email && err.errors.email.kind == 'unique') {
         return res.status(409).json({
           error: "email already in use"
         });
       }
       console.log(err);
       res.sendStatus(500);
      });
    });
  });

};

const profile = async (req, res) => {
  // TODO:
  // Implement the functionality to retrieve the details
  // of the logged in user.
  // Check for the token and then use it to get user details
  const authHeader = req.headers.authorization;
  if (authHeader && 
    authHeader.split(' ')[0].toLowerCase() == 'token' &&
    authHeader.split(' ').length == 2) {
    const token = authHeader.split(' ')[1];

    Token.findOne({'token':token},'user',(err,token)=>{
      if(err) {
        console.log(err);
        res.sendStatus(500);
      }
      if (token==null){
        return res.status(401).json({
          error: "Invalid Token"
        });
      }
      User.findById(token.user,'_id name email username',(err,user)=>{
        if (user == null) {
          return res.status(404).json({
            error: "User Not Found"
          });
        }
        res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username
        });
      });
    });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = { login, signup, profile };
