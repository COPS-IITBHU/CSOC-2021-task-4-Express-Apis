const { Token }= require("../models")

const checkAuth= async function(req,res,next) {
    const userToken = req.headers.token
    if(userToken){
        await Token.findOne({token:userToken}).populate('user').exec(function(err,foundToken){
            if(err) console.log(err)
            if(foundToken){
            const { user }= foundToken
            req.user=user
            next()
            }else{
                res.status(401).send("User with this token does not exist .")
            }
            })
    }else{
        res.status(401).send("Please login first to get the user profile.")
    }
    
  }


module.exports.middleware = { checkAuth }