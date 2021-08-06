
const { User, Token, ToDo } = require("../models");

// format 
// authorization : Token <token>

const requireAuth = (req, res, next) => {

    const tokenHeader = req.headers['authorization']

    if (typeof tokenHeader !== 'undefined') {

        const header = tokenHeader.split(' ');
        const token = header[1];

        Token.findOne({
            token: token
        })
            .then((result) => {
                if (result) {
                    req.user = result.user;
                    next();
                }
                else
                    res.status(401).send("The requested page needs a username and a password.");

            })
            .catch((err) => console.log(err))

    }
    else {
        res.status(401).send("The requested page needs a username and a password or a token");

    }

}


const AuthTodoOperation = (req, res, next) => {

    ToDo.find({
        _id: req.params.id,
        $or: [
            { createdBy: req.user },
            { collaborators: { $all: [req.user] } }
        ]
    })
        .then((todo) => {

            if (todo.length != 0)
                next();
            else
                res.status(403).send("BOOK with the requested userid not available ")
        })
        .catch((err) => console.log(err))
}



const AuthCreateTodo = (req, res, next) => {

    if (req.user == req.params.id)
        next();
    else {
        res.status(403).send("Access is forbidden => due to  WRONG USER-ID.")
    }
}


const AuthColabPermissions = (req, res, next) => {

    ToDo.find({
        _id: req.params.id,   // checks todo exits or not
        createdBy: req.user      // to chxk which  user created 
    })
        .then((todo) => {    // todo is an array

            if (todo.length != 0)
                next();
            else
                res.status(403).send("Access is forbidden to the requested page.")
        })
        .catch((err) => console.log(err))
}



module.exports = { requireAuth, AuthCreateTodo, AuthTodoOperation, AuthColabPermissions };