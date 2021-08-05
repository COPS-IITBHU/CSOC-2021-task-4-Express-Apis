const { User, Token } = require("../models");
const { randomBytes } = require("crypto");
const bcrypt = require('bcrypt');
const { create } = require("../models/user");

const createToken = (user) => {
  return Token({
    user: user._id,
    token: randomBytes(40).toString("hex"),
  });
};



const login = async (req, res) => {
  // TODO: Read username, pwd from the req object
  // Return correct status codes: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  // If the user is verified, then return a token along with correct status code
  
  try{
    const {username,pwd} = req.body
    if (!(username&&pwd)){
      return res.send(400).send("Please fill all the fields.")
    }
    User.findOne({username: username},async function(err, foundUser){
      if(foundUser){ 
        const passIsCorrect = await bcrypt.compare(pwd, foundUser.password)
        if(!passIsCorrect){
          return res.status(403).send("Password is incorrect.Please enter correct password to login.")
        }
        Token.findOne({user:foundUser._id},function(err, tokenOfUser){
          return res.status(200).json(tokenOfUser.token)
        })
        
      }else{
        return res.status(404).send("Wrong username.Signup if you are a new user.")
      }
    })
  }catch(err){
    console.log(err);
  }

};

const signup = async (req, res) => {
  
  // TODO: Read username, email, name, pwd from the req object
  // Hash the password
  // Return with appropriate status code in case of an error
  // If successful, return with an appropriate token along with correct status code

  try{   

    const {username,email,name,pwd}=req.body
    if(!(username&&email&&name&&pwd)){
      
      return res.status(400).send("Please fill in all the fields.")
    }
    await User.findOne({$or: [{email:email},{username:username}]},function(err,user){
      if(user){      
      return res.status(409).send("User with the same username or email already exists.")
    }
    });
    

    const hashedPassword = await bcrypt.hash(pwd, 10);

    const user = await User.create(
      { 
        name:name,
        username:username,
        password:hashedPassword,
        email:email.toLowerCase(),

      }
    )
    const userToken=createToken(user)
    userToken.save()

    res.status(200).json(userToken.token)

  }catch(err){ 
    console.log(err);
  }
};

const profile = async (req, res) => {

  // TODO:
  // Implement the functionality to retrieve the details
  // of the logged in user.
  // Check for the token and then use it to get user details
  // {
  //   "id":  1,
  //   "name":  "string",
  //   "email":  "user@example.com",
  //   "username":  "string"
  // }
 
  const user = req.user
  const {id,name,email,username}= user

  res.status(200).json({"id": id, 
  "name":name,
  "email":email,
  "username": username
  })

};


module.exports = { login, signup, profile};
