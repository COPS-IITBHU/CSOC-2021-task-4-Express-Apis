const { User, Token } = require("../models");
const { randomBytes } = require("crypto");
const crypto = require("crypto")

const createToken = (user) => {
  return Token({
    user: user._id,
    token: randomBytes(40).toString("hex"),
  });
};




async function hash(password) {
  return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(8).toString("hex")

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          resolve(salt + ":" + derivedKey.toString('hex'))
      });
  })
}



async function verify(password, hash) {
  return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(":")
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          resolve(key == derivedKey.toString('hex'))
      });
  })
}

const login = async (req, res) => {
  // TODO: Read username, pwd from the req object
  // Check if data is valid
  // Return correct status codes: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  // If the user is verified, then return a token along with correct status code
  try{
  const {username,password} = req.body 
  const user = await User.findOne({"username":username})
  if(!user){
    return res.status(400).send("Wrong username")
  }
  const verification = await verify(password,user.password)
  if(verification){
    const token = await Token.findOne({user: user._id})
    return res.status(200).send({'token': token.token})
  }
  return res.status(400).send('Wrong password')
  }
  catch(err){
    res.status(400).send(err)
  }
};



const signup = async (req, res) => {
  // TODO: Read username, email, name, pwd from the req object
  // Hash the password
  // Return with appropriate status code in case of an error
  // If successful, return with an appropriate token along with correct status code
  req = req.body
  const password = await hash(req.password)
  try{
  await User({name: req.name, email: req.email,username:req.username,password:password})
  .save().then(user => {
    const token = createToken(user).token
    Token({'user': user._id, 'token':token})
    .save().then(res.status(200).send({"token": token}))
  })
  }
  catch (err){
    res.status(409).send(err)
  }
};

const profile = async (req, res) => {
  if(!req.headers.authorizations){
    return res.status(401).send('Authentication token required')
  }
  try{
  const token = await Token.findOne({'token':req.headers.authorizations })
  if(!token){
    return res.status(401).send('Wrong token')
  }
  const user = await User.findOne({_id: token.user})
  res.status(200).send({
    "id":  user._id,
    "name":  user.name,
    "email":  user.email,
    "username":  user.username
  })
  }catch(err){
    res.status(401).send(err)
  }
  // TODO:
  // Implement the functionality to retrieve the details
  // of the logged in user.
  // Check for the token and then use it to get user details

};

module.exports = { login, signup, profile };
