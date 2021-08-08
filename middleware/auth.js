const Token = require("../models/token");

module.exports = () => {
    return async (req, res, next) => {
        // console.log(req.headers.authorization);
        const authToken = req.headers.authorization;
        const token = authToken.slice(7);
        // console.log("token:", token);

        if (!token) {
            res.status(401).send("Authentication token was not found!")
        } else {
            const foundToken = await Token.findOne({ token: token }).populate('user');
            if (foundToken) {
                req.user = foundToken.user;
                // console.log(foundToken.user);
                next();
            } else {
                res.status(404).send("User not found!");
            }
        }
    }
}