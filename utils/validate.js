const mongoose = require('mongoose');
const isValidUsername = (username) =>{
    const usernameRegex = /^[\w.@+-]{1,150}$/gm
    if (typeof(username) != 'string') {
        return false;
    }
    return usernameRegex.test(username);
}

const isValidPassword = (password) => {
    // Check conditions if required
    return typeof(password) == 'string';
}

const isValidEmail = (email) => {
    if (typeof(email) != 'string') {
        return false;
    }
    const emailRegex = /^\S+@\S+/gm;
    return emailRegex.test(email);
}

const isValidName = (name) => {

    return typeof(name) == 'string' && name.length >=1
}
const validateParams = (req,res,next) => {
    if (req.params.id && !mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            error: "Invalid Id"
        });
    }
    next();
}

const validateBody = (schema) => (req,res,next) => {
    for(let key in schema) {
        if (!req.body[key]) {
            return res.status(400).json({
                error: `Missing required field '${key}'`
            });
        }
        if (typeof(req.body[key]) != schema[key]) {
            return res.status(400).json({
                error: `'${key}' must be of type '${schema[key]}'`
            });
        }
    }
    next();
}

module.exports = {
    isValidUsername,
    isValidPassword,
    isValidEmail,
    isValidName,
    validateParams,
    validateBody
}