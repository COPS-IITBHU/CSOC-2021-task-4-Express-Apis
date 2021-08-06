const { User, Token } = require("../models");
const { randomBytes } = require("crypto");
const bcrypt = require('bcrypt');

const createToken = (user) => {
  return Token.create({
    user: user._id,
    token: randomBytes(40).toString("hex"),
  });
};


const handleErrors = (err) => {
  let error = { name: '', username: '', email: '', password: '' }


  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach((errEle) => {

      if (errEle.properties.type === "unique") {
        error[errEle.properties.path] = `${errEle.properties.path} already exits`
      }
      else
        error[errEle.properties.path] = errEle.properties.message
    })
  }
  return error;
}


const login = async (req, res) => {
  // TODO: Read username, pwd from the req object
  // Check if data is valid
  // Return correct status codes: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  // If the user is verified, then return a token along with correct status code

  const password = req.body.password;

  User.findOne({ username: req.body.username })
    .then((user) => {

      if (user) {

        bcrypt.compare(password, user.password)
          .then((auth) => {
            if (auth) {

              Token.find({ user: user._id, })

                .then((result) => {
                  if (result.length != 0)
                    res.status(201).send([{ user, result }])

                })
                .catch((err) => console.log(err))
            }
            else {
              res.status(401).send("WRONG LOGIN CREDENTIALS");
            }

          })
          .catch((err) => console.log(err))
      }
      else
        res.status(401).send("Wrong Credentials")

    })
    .catch((err) => {
      console.log(err)
    })


};

const signup = async (req, res) => {
  // TODO: Read username, email, name, pwd from the req object
  // Hash the password
  // Return with appropriate status code in case of an error
  // If successful, return with an appropriate token along with correct status code

  User.create(req.body)
    .then((user) => {
      const token = createToken(user)        // crypto
        .then((result) => res.status(201).send([{ user, result }]))
        .catch((err) => console.log(err))

    })
    .catch((err) => {
      const errors = handleErrors(err);
      res.status(403).send(errors)
    })

};

const profile = async (req, res) => {
  // TODO:
  // Implement the functionality to retrieve the details
  // of the logged in user.
  // Check for the token and then use it to get user details

  User.findById(req.user, { password: false })      // id = req.user
    .then((user) => res.send(user))
    .catch((err) => console.log(err))

};

module.exports = { login, signup, profile };
