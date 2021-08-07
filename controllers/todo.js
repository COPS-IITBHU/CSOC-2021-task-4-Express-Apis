const { ToDo, Token, User } = require("../models");

// All the given method require token.
// So be sure to check for it before doing any stuff
// HINT: Create a middleware for above :)

const getAllToDo = async (req, res) => {
  // Get the token in header.
  // Use the token to get all the ToDo's of a user
  console.log(req.user);
  ToDo.find(
    {
      $or: [
        { createdBy: req.user.id },
        { collaborators: req.user.id }
      ]
    },
    '_id title createdBy',
    (err, todos) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      const createdTodos = todos.filter(todo => todo.createdBy == req.user.id);
      const collabTodos = todos.filter(todo => todo.createdBy != req.user.id);
      User.find({
        _id: { $in: collabTodos.map(todo => todo.createdBy) }
      },
        '_id username',
        (err, creators) => {
          console.log(creators);
          res.status(200).json({
            createdTodos: createdTodos.map(todo => ({
              id: todo.id,
              title: todo.title
            })),
            collabTodos: collabTodos.map(todo => ({
              id: todo.id,
              title: todo.title,
              createdBy: creators.find(creator => creator.id == todo.createdBy).username
            }))
          }
          );
        });

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
  todo.save().then(todo => res.status(200).json(
    {
      id: todo.id,
      title: todo.title
    }
  )).catch(err => {
    console.log(err);
    res.sendStatus(500);
  });

};

const getParticularToDo = async (req, res) => {
  // Get the Todo of the logged in user with given id.
  console.log(req.user);
  ToDo.findById(req.params.id, '_id title', (err, todo) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (todo == null) {
      return res.sendStatus(404);
    }
    if (todo.createdBy != req.user.id && !todo.collaborators.includes(req.user.id)) {
      return res.sendStatus(403);
    }
    res.status(200).json(
      {
        id: todo.id,
        title: todo.title
      }
    );
  });
};

const editToDo = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response.
  ToDo.findById(req.params.id, (err, todo) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (todo == null) {
      return res.sendStatus(404);
    }
    if (todo.createdBy != req.user.id && !todo.collaborators.includes(req.user.id)) {
      return res.sendStatus(403);
    }
    todo.title = req.body.title;
    todo.save().then(todo => res.status(200).json({
      id: todo.id,
      title: todo.title
    }));
  });
};

const editToDoPatch = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response
  editToDo(req, res);
};

const deleteToDo = async (req, res) => {
  //  Delete the todo with given id
  ToDo.findByIdAndDelete(req.params.id, (err, todo) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (todo == null) {
      return res.sendStatus(404);
    }
    if (todo.createdBy != req.user.id && !todo.collaborators.includes(req.user.id)) {
      return res.sendStatus(403);
    }
    todo.remove((err, _) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.sendStatus(204);
    })
  })
};

const addCollaborators = async (req, res) => {
  // Add Collaborators to todo with given id
  const collaborators = req.body.collaborators;
  ToDo.findById(req.params.id, (err, todo) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (todo == null) {
      return res.sendStatus(404);
    }
    if (todo.createdBy != req.user.id) {
      return res.sendStatus(403);
    }
    User.find({ username: { $in: collaborators } }, '_id username', (err, collabs) => {
      let invalidUsers = []
      if (collabs.length != collaborators.length) {
        collaborators.forEach(collaborator => {
          if (!collabs.includes(collaborator.username)) {
            invalidUsers.push(collaborator.username);
          }
        })
      }
      if (todo.collaborator) {
        todo.collaborators.concat(collabs.map(collab => collab.id));
      } else {
        todo.collaborators = collabs.map(collab => collab.id);
      }
      todo.save().then(_ => {
        if (invalidUsers.length == 0) {
          res.sendStatus(200);
        } else {
          res.status(404).json({
            invalid_users: invalidUsers
          })
        }
      })
    })
  })
};

const removeCollaborator = async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  ToDo.findById(req.params.id, (err, todo) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (todo == null) {
      return res.status(404).json({
        error: "Todo not found"
      });
    }
    if (todo.createdBy != req.user.id) {
      return res.sendStatus(403);
    }
    User.findOne({ username: req.body.collaborator }, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (user == null) {
        return res.status(404).json({
          error: "User not found"
        });
      }
      if (!todo.collaborators.includes(user.id)) {
        return res.status(404).json({
          error: "User not found in collaborators"
        });
      }
      todo.collaborators.splice(todo.collaborators.indexOf(user.id), 1);
      console.log(todo);
      todo.save().then(_ => res.send(200)).catch(_ => res.sendStatus(500));
    });
  });
}

module.exports = {
  createToDo,
  deleteToDo,
  editToDo,
  editToDoPatch,
  getAllToDo,
  getParticularToDo,
  addCollaborators,
  removeCollaborator,
};
