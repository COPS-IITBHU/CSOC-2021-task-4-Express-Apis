
const { ToDo, Token, User } = require("../models");

// All the given method require token.
// So be sure to check for it before doing any stuff
// HINT: Create a middleware for above :)

const getAllToDo = async (req, res) => {
  // Get the token in header.
  // Use the token to get all the ToDo's of a user

  ToDo.find({
    $or: [
      { createdBy: req.user },
      { collaborators: { $all: [req.user] } }
    ]
  } )
  // .populate('collaborators')
    .then((result) => {
      if (result.length != 0){
        //  collaborators = collaborators.username
        res.status(200).send(result)
      }
      else
        res.status(404).send("No todos available")
    })
    .catch((err) => console.log(err))
};

const createToDo = async (req, res) => {
  // Check for the token and create a todo
  // or throw error correspondingly

  let todo = {
    title: req.body.title,
    createdBy: req.params.id
  }
  ToDo.create(todo)
    .then((newTodo) => res.status(201).send(newTodo))
    .catch((err) => console.log(err))
};

const getParticularToDo = async (req, res) => {
  // Get the Todo of the logged in user with given id.

  ToDo.findById(req.params.id)
    .then((result) => res.status(200).send(result))
    .catch((err) => console.log(err))

};

const editToDo = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response.

  ToDo.findByIdAndUpdate(req.params.id, { title: req.body.title })
    .then(() => {

      ToDo.findOne({ _id: req.params.id })
        .then((updatedTodo) => res.status(200).send(updatedTodo))

    })
    .catch((err) => console.log(err))
};

const editToDoPatch = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response

  ToDo.findByIdAndUpdate(req.params.id, { title: req.body.title })
    .then(() => {

      ToDo.findOne({ _id: req.params.id })
        .then((updatedTodo) => res.status(200).send(updatedTodo))

    })
    .catch((err) => console.log(err))

};

const deleteToDo = async (req, res) => {
  //  Delete the todo with given id

  ToDo.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).send("DELETED SUCESSFULLY"))
    .catch((err) => console.log(err))
};





const addCollaborators = async (req, res) => {
  //  add collborators

  User.findOne({ username: req.body.username })
    .then((user) => {

      if (!user) {
        res.send("Username does not exits")
      }

      else {
        ToDo.findById(req.params.id)
          .then((todo) => {
            todo.collaborators.push(user._id);

            ToDo.findByIdAndUpdate(req.params.id, { collaborators: todo.collaborators })
              .then(() => {

                ToDo.findOne({ _id: req.params.id })
                  .then((todo) => res.status(201).send(todo))

              })

          })
      }


    })

};



const removeCollaborators = async (req, res) => {
  //  remove collaborators

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        ToDo.findById(req.params.id)
          .then((result) => {


            if (result.collaborators.includes(user._id)) {
              result.collaborators.splice(result.collaborators.indexOf(user._id), 1)

            }
            else
              res.send("No such collaborator exits in todo")

            ToDo.findByIdAndUpdate(req.params.id, { collaborators: result.collaborators }, () => {
              res.status(200).send("collaborator deleted")
            })

          })
      }
      else
        res.send("No such collaborator exits in todo")

    })



};


module.exports = {
  createToDo,
  deleteToDo,
  editToDo,
  editToDoPatch,
  getAllToDo,
  getParticularToDo,
  removeCollaborators,
  addCollaborators
};
