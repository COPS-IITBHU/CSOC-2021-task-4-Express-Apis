
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
  }, { createdAt: 0, updatedAt: 0, __v: 0 })
    // .populate('createdBy', 'username )
    .populate({ path: 'createdBy', select: 'username -_id' })
    .populate({ path: 'collaborators', select: 'username -_id' })

    .then((result) => {
      if (result.length != 0) {
        res.status(200).status(200).send(result)
      }
      else
        res.status(200).send("No todos available")
    })
    .catch((err) => console.log(err))
};

const createToDo = async (req, res) => {
  // Check for the token and create a todo
  // or throw error correspondingly

  if (req.body.title) {
    let todo = {
      title: req.body.title,
      createdBy: req.params.id
    }
    ToDo.create(todo)
      .then((newTodo) => res.status(200).send(newTodo))
      .catch((err) => console.log(err))
  }
  else
    res.status(400).send("Title is rquired")
};

const getParticularToDo = async (req, res) => {
  // Get the Todo of the logged in user with given id.

  ToDo.findById(req.params.id, { createdAt: 0, updatedAt: 0 })
    .populate({ path: 'createdBy', select: 'username -_id' })
    .populate({ path: 'collaborators', select: 'username -_id' })
    .then((sinleTodo) => {
      if (sinleTodo)
        res.status(200).send(sinleTodo)
      else
        res.status(200).send("No todo available with the requested book id. you might have entered wrong bookid")
    }
    )
    .catch((err) => console.log(err))

};

const editToDo = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response.

  ToDo.findByIdAndUpdate(req.params.id, { title: req.body.title })
    .then(() => {

      ToDo.findOne({ _id: req.params.id },)
        .populate({ path: 'createdBy', select: 'username -_id' })
        .populate({ path: 'collaborators', select: 'username -_id' })
        .then((updatedTodo) => res.status(200).send(updatedTodo))

    })
    .catch((err) => console.log(err))
};

const editToDoPatch = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response

  ToDo.findByIdAndUpdate(req.params.id, { title: req.body.title })
    .then(() => {

      ToDo.findOne({ _id: req.params.id })
        .populate({ path: 'createdBy', select: 'username -_id' })
        .populate({ path: 'collaborators', select: 'username -_id' })
        .then((updatedTodo) => res.status(200).send(updatedTodo))

    })
    .catch((err) => console.log(err))

};

const deleteToDo = async (req, res) => {
  //  Delete the todo with given id

  ToDo.findByIdAndDelete(req.params.id)
    .then((dlt) => {

        res.status(204).send("DELETED SUCESSFULLY")
      
    }
    )
    .catch((err) => console.log(err))
};





const addCollaborators = async (req, res) => {
  //  add collborators

  User.findOne({ username: req.body.username })
    .then((user) => {

      if (!user) {
        res.status(400).send("Username does not exits")
      }

      else {
        ToDo.findById(req.params.id)
          .then((todo) => {
            todo.collaborators.push(user._id);

            ToDo.findByIdAndUpdate(req.params.id, { collaborators: todo.collaborators })
              .then(() => {

                ToDo.findOne({ _id: req.params.id })

                  .populate({ path: 'createdBy', select: 'username -_id' })
                  .populate({ path: 'collaborators', select: 'username -_id' })
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

              ToDo.findOne({ _id: req.params.id })

                .populate({ path: 'createdBy', select: 'username -_id' })
                .populate({ path: 'collaborators', select: 'username -_id' })
                .then((todo) => res.status(200).send(todo))
            })

          })
      }
      else
        res.status(400).send("No such collaborator exits in todo")

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
