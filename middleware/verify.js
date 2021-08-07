
const { User, Token, ToDo } = require("../models");

// format 
// authorization : Token <token>

const requireAuth = (req, res, next) => {

    // checks user is login or not

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
        res.status(401).send("The requested page needs a username and a password and a token in authorization header");

    }

}


const AuthTodoOperation = (req, res, next) => {

    //  For editing and deleting todos by only creator of the todo and its collaborators

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
                res.status(403).send("BOOK with the requested bookid not available ")
        })
        .catch((err) => console.log(err))
}



const AuthCreateTodo = (req, res, next) => {

    if (req.user == req.params.id)
        next();
    else {
        res.status(400).send("Wrong user id.")
    }
}


const AuthColabPermissions = (req, res, next) => {  
    
    //  For adding and removing collaborators by only creator of the todo

    ToDo.find({
        _id: req.params.id,   
        createdBy: req.user     
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