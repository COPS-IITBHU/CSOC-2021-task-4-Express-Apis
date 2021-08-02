const { ToDo, Token } = require("../models");
const todo = require("../models/todo");

// All the given method require token.
// So be sure to check for it before doing any stuff
// HINT: Create a middleware for above :)

const verifyToken = (req, res) => {
  // Get the token in header.
  // Use the token to get all the ToDo's of a user
  try{
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.token || req.headers.authorization.split(' ')[1];
    if (!token) {
      return null;
      // return res.status(403).send("A token is required for authentication");
    }
    else{
      return token;
    }

  }
  catch(err){
    return null;
  }

};

const getAllToDo = async (req, res) => {
  // Get the token in header.
  // Use the token to get all the ToDo's of a user
  const token = verifyToken(req,res);
  if(token != null){
    Token.findOne({token: token}, function(err, foundToken){
      if(err){
        res.send(err)
      }
      else{
        if(foundToken){
              ToDo.find({ $or: [{createdBy : foundToken.user}, {collaborators: {"$in" : foundToken.user._id.toString()}}]}, function(err, foundUsers){
                if(foundUsers){
                  users = []
                  foundUsers.forEach(function(user){
                    users.push({
                      id: user._id,
                      title: user.title
                    })
                  })
                  res.status(200).send(users)
                }
              })
        }
        else{
          res.status(401).json({
            detail: "Authentication credentials were not provided."
          })
        }
      }
    })
  }
  else{
    res.status(401).json({
      detail: "Authentication credentials were not provided."
    })
  }
};

const createToDo = async (req, res) => {
  // Check for the token and create a todo
  // or throw error correspondingly
  const token = verifyToken(req,res);
  if(token != null){
    Token.findOne({token: token}, function(err, foundToken){
      if(err){
        res.send(err)
      }
      else{
        if(foundToken){
              const newTodo = new ToDo({
                title: req.body.title,
                createdBy: foundToken.user
              })
              newTodo.save(function(err){
                if(!err){
                  res.status(200).json({id: req.params.id, title: newTodo.title})
                }
                else{
                  res.send("User with the Id already exists");
                }
              })
        }
        else{
          res.status(401).json({
            detail: "Authentication credentials were not provided."
          })
        }
      }
    })
  }
  else{
    res.status(401).json({
      detail: "Authentication credentials were not provided."
    })
  }
};

const getParticularToDo = async (req, res) => {
  // Get the Todo of the logged in user with given id.
  const token = verifyToken(req, res)
  if(token != null){
    ToDo.findById(req.params.id, function(err, foundTodo){
      if(foundTodo){
        res.status(200).json({id:foundTodo._id, title:foundTodo.title})
      }
    })
  }else{
    res.status(401).json({
      detail: "Authentication credentials were not provided."
    })
  }
};

const editToDo = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response.
  const token = verifyToken(req, res)

  if(token != null){
    Token.findOne({token: token}, function(err, foundToken){
      if(foundToken){
        ToDo.update({_id:req.params.id}, 
          {
          title:req.body.title,
          createdBy: foundToken.user
          }, 
          {overwrite: true}, 
          function(err, result){
            if(!err){
              if(result){
              }
            }
        })
        ToDo.findOne({_id:req.params.id}, function(err, result){
          if(!err){
            if(result){
              res.status(200).json({id: result._id, title:result.title})
            }
          }
        })
      }
    })
  }else{
    res.status(401).json({
      detail: "Authentication credentials were not provided."
    })
  }
};

const editToDoPatch = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response
  const token = verifyToken(req, res)

  if(token != null){
    Token.findOne({token: token}, function(err, foundToken){
      if(foundToken){
        ToDo.updateMany({_id:req.params.id}, 
          {
            $set: {title: req.body.title}
          }, 
          function(err, result){
        })
        ToDo.findOne({_id:req.params.id}, function(err, result){
          if(!err){
            if(result){
              res.status(200).json({id: result._id, title:result.title})
            }
          }
        })
      }
    })
  }else{
    res.status(401).json({
      detail: "Authentication credentials were not provided."
    })
  }
};

const deleteToDo = async (req, res) => {
  //  Delete the todo with given id
  const token = verifyToken(req, res)
  if(token != null){
    ToDo.deleteOne({_id:req.params.id}, function(err){
      if(!err){
        res.status(204).send("Succesfully Deleted")
      }
    })
  }else{
    res.status(401).json({
      detail: "Authentication credentials were not provided."
    })
  }
};

const addCollaborators = async (req, res) => {
  //  Delete the todo with given id
  const token = verifyToken(req,res);
  if(token != null){
    Token.findOne({token: token}, function(err, foundToken){
      if(err){
        res.send(err)
      }
      else{
        if(foundToken){
          ToDo.updateMany({ $and: [{_id:req.params.id}, {collaborators: {"$nin" : foundToken.user._id.toString()}} ] }, 
            {
              $push: {collaborators: req.body.id}
            }, 
            function(err, result){
              if(err){
                res.status(401).send("Collaborators of a task can't add collaborators")
              }
              else if(result.nModified == 0)
              {
                res.status(401).send("Collaborators of a task can't add collaborators")
              }
              else{
                res.status(200).send("Collaborators added")
              }
          })
        }
        else{
          res.status(401).json({
            detail: "Authentication credentials were not provided."
          })
        }
      }
    })
  }
  else{
    res.status(401).json({
      detail: "Authentication credentials were not provided."
    })
  }
};

const removeCollaborators = async (req, res) => {
  //  Delete the todo with given id
  const token = verifyToken(req,res);
  if(token != null){
    Token.findOne({token: token}, function(err, foundToken){
      if(err){
        res.send(err)
      }
      else{
        if(foundToken){
          ToDo.updateMany({ $and: [{_id:req.params.id}, {collaborators: {"$nin" : foundToken.user._id.toString()}} ] }, 
            {
              $pull: {collaborators: req.body.id}
            }, 
            function(err, result){
              if(err){
                res.send(err)
              }
              else if(result.nModified == 0)
              {
                res.status(401).send("Collaborators of a task can't add collaborators")
              }
              else if(!err){
                res.status(204).send("Succesfully Deleted")
              }

          })
        }
        else{
          res.status(401).json({
            detail: "Authentication credentials were not provided."
          })
        }
      }
    })
  }
  else{
    res.status(401).json({
      detail: "Authentication credentials were not provided."
    })
  }
};

module.exports = {
  createToDo,
  deleteToDo,
  editToDo,
  editToDoPatch,
  getAllToDo,
  getParticularToDo,
  addCollaborators,
  removeCollaborators
};
