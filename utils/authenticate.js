const { Token, User } = require("../models");

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.split(' ')[0] == 'token') {
        const token = authHeader.split(' ')[1];
        Token.findOne({token},'user',(err,tokenObject)=>{
            User.findById(tokenObject.user,'_id name email username',(err,user)=>{
                req.user = {
                    id: user.id,
                    name:user.name,
                    email: user.email,
                    username: user.username
                };
                return next();
            })
        })
    } else {
        res.sendStatus(401);
    }
}

module.exports = authenticateToken