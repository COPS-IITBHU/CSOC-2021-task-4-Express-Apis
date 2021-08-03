const { ToDo, Token } = require("../models");

// All the given method require token.
// So be sure to check for it before doing any stuff
// HINT: Create a middleware for above :)

const getAllToDo = async (req, res) => {
  // Get the token in header.
  // Use the token to get all the ToDo's of a user
  console.log(req.user);
  ToDo.find({createdBy:req.user.id},(err,todos)=>{
    res.status(200).json(todos.map(todo=>({
      id: todo.id,
      title: todo.title
    })));
  });
};

const createToDo = async (req, res) => {
  // Check for the token and create a todo
  // or throw error correspondingly
  console.log(req.user);
  const todo = new ToDo({
    title: req.body.title,
    createdBy: req.user.id
  });
  console.log(todo);
  todo.save().then(todo=>res.status(200).json(
    {
      id: todo.id,
      title: todo.title
    }
  ));

};

const getParticularToDo = async (req, res) => {
  // Get the Todo of the logged in user with given id.
  console.log(req.user);
  ToDo.findById(req.params.id,'_id title',(err,todo)=>{
    res.status(200).json(
      {
        id: todo.id,
        title: todo.title
      }
    )
  })
};

const editToDo = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response.
  ToDo.findById(req.params.id,(err,todo)=>{
    todo.title = req.body.title;
    todo.save().then(todo=>res.status(200).json({
      id: todo.id,
      title: todo.title
    }));
  });
};

const editToDoPatch = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response
};

const deleteToDo = async (req, res) => {
  //  Delete the todo with given id
  ToDo.findByIdAndDelete(req.params.id,(err,_)=>{
    if (_ != null){
      return res.sendStatus(204);
    }
    res.sendStatus(404);
  })
};

module.exports = {
  createToDo,
  deleteToDo,
  editToDo,
  editToDoPatch,
  getAllToDo,
  getParticularToDo,
};
