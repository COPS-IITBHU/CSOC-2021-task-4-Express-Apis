const { Token, User } = require("../models");

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(authHeader && 
        authHeader.split(' ')[0] == 'token' && 
        authHeader.split(' ').length == 2) {
        const token = authHeader.split(' ')[1];
        Token.findOne({token},'user',(err,tokenObject)=>{
            if (token==null) {
                return res.status(401).json({
                    error: "Invalid Token"
                });
            }
            User.findById(tokenObject.user,'_id name email username',(err,user)=>{
                if (user==null) {
                    return res.status(401).json({
                        error: "User with that token no longer exists"
                    });
                }
                req.user = {
                    id: user.id,
                    name:user.name,
                    email: user.email,
                    username: user.username
                };
                return next();
            });
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = authenticateToken