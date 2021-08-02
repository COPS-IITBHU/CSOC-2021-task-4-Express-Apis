const { User, Token } = require("../models");
const { randomBytes } = require("crypto");


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

  const username = req.body.username
  const password = require("crypto").createHash("sha256").update(req.body.password).digest("hex")

  User.findOne({username:username}, function(err, foundUser){
    if(err){
      console.log(err)
    }else{
      if(foundUser.password == password){
        Token.findOne({user: foundUser}, function(error, foundToken){
          if(err){
            console.log(error)
          }else{
            res.status(200).json({token: foundToken.token});
          }
        })
      }else{
        res.send("User Not Found")
      }
    }
  })
};

const signup = async (req, res) => {
  // TODO: Read username, email, name, pwd from the req object
  // Hash the password
  // Return with appropriate status code in case of an error
  // If successful, return with an appropriate token along with correct status code

  const username = req.body.username
  const email = req.body.email
  const name = req.body.name
  const password = req.body.password

  const newUser = new User({
    name: name,
    email: email,
    username :username,
    password : require("crypto").createHash("sha256").update(password).digest("hex")
  })

  newUser.save(function(err){
    if(err){
      console.log(err)
    }else{
      const token = createToken(newUser)
      token.save()
      res.status(200).json({token: token.token })
    }
  })

};

const profile = async (req, res) => {
  // TODO:
  // Implement the functionality to retrieve the details
  // of the logged in user.
  // Check for the token and then use it to get user details
  // User.findOne({username:req.body.username, password: req.body.username})

  console.log(req.headers.authorization.split(' ')[1])

  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.token || req.headers.authorization.split(' ')[1];

    Token.findOne({token: token}, function(err, foundToken){
      if(err){
        console.log(err)
      }
      else{
        if(foundToken){
          User.findById(foundToken.user, function(err, foundUser){
            if(foundUser){
              res.status(200).json({id: foundUser._id, name: foundUser.name, email: foundUser.email, username: foundUser.email})
            }
          })
        }
        else{
          res.send("Token not found")
        }
      }
    })
};

module.exports = { login, signup, profile };
