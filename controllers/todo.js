const { ToDo, User } = require("../models");

const getAllToDo = async (req, res) => {
  const userId = req.user.id;

  const createdTodos = await ToDo.find({ createdBy: userId });
  const user = await User.findById(userId).populate('collaboratingTodos');
  if (createdTodos) {
    res.status(200).json({ createdTodos: createdTodos, collaboratingTodos: user.collaboratingTodos });
  } else {
    res.status(404).send("Todos not found");
  }
};

const createToDo = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(400).send("Title field is empty!");
  } else {
    const newTodo = new ToDo({
      title: title,
      createdBy: req.user.id
    });
    await newTodo.save();

    res.status(200).json({ title: title, createdBy: req.user.id });
  }
};

const creator = (userId, todo) => { return userId == todo.createdBy; }

const collaborator = (userId, todo) => {
  const foundCollaborator = todo.collaborators.filter(collaboratorId => collaboratorId == userId);
  if (foundCollaborator.length > 0) return true;
  return false;
}

const getParticularToDo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;
  const todo = await ToDo.findById(todoId);
  // console.log(creator(userId, todo), collaborator(userId, todo));

  if (!todo) {
    res.status(404).send("Todo of given id not found!")
  } else if (creator(userId, todo) || collaborator(userId, todo)) {
    res.status(200).json(todo);
  } else {
    res.status(403).send("Logged in user not authorized to view todo of given id.");
  }
};

const editToDo = async (req, res) => {
  const { title } = req.body;
  const todoId = req.params.id;
  const userId = req.user.id;
  const todo = await ToDo.findById(todoId);

  if (!title) {
    res.status(400).send("Title field is empty!");
  } else if (creator(userId, todo) || collaborator(userId, todo)) {
    const queryTodo = await ToDo.findByIdAndUpdate(todoId, { title: title });

    if (queryTodo) {
      res.status(200).json({ id: todoId, title: title });
    } else {
      res.status(404).send("Todo of given id not found!");
    }
  } else {
    res.status(403).send("Logged user is not authorized to edit todo of given id!");
  }
};

const editToDoPatch = async (req, res) => {
  const { title } = req.body;
  const todoId = req.params.id;
  const userId = req.user.id;
  const todo = await ToDo.findById(todoId);

  if (!title) {
    res.status(400).send("Title field is empty!");
  } else if (creator(userId, todo) || collaborator(userId, todo)) {
    const queryTodo = await ToDo.findByIdAndUpdate(todoId, { title: title });

    if (queryTodo) {
      res.status(200).json({ id: todoId, title: title });
    } else {
      res.status(404).send("Todo of given id not found!");
    }
  } else {
    res.status(403).send("Logged user is not authorized to edit todo of given id!");
  }
};

const deleteToDo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;
  const todo = await ToDo.findById(todoId);

  if (!todo) {
    res.status(404).send("Todo of given id not found!");
  } else if (creator(userId, todo) || collaborator(userId, todo)) {
    const deleteTodo = await ToDo.findByIdAndDelete(todoId);

    if (deleteTodo) {
      res.status(204).send("Todo of given id deleted");
    } else {
      res.status(501).send("Couldn't delete task.");
    }
  } else {
    res.status(403).send("Logged user is not authorized to edit todo of given id!");
  }
};

const addCollaborator = async (req, res) => {
  const { collaboratorId } = req.body;
  const todoId = req.params.id;
  const userId = req.user.id;

  const collaborator = await User.findById(collaboratorId);
  const todo = await ToDo.findById(todoId);

  const flag = collaboratorId != todo.createdBy;

  if (creator(userId, todo) && flag) {
    collaborator.collaboratingTodos.push(todoId);
    todo.collaborators.push(collaboratorId);
    collaborator.save();
    todo.save();
    
    res.status(200).json(todo);
  } else if (!flag) {
    res.status(400).send("Creater cannot collaborate!");
  } else if (!creator(userId, todo)) {
    res.status(403).send("Only creator of a todo can add collaborators");
  } else {
    res.status(404).send("User or Todo of given id not found!");
  }
}

const removeCollaborator = async (req, res) => {
  const { collaboratorId } = req.body;
  const todoId = req.params.id;
  const userId = req.user.id;

  const collaborator = await User.findById(collaboratorId);
  const todo = await ToDo.findById(todoId);

  if (creator(userId, todo) && todo) {
    collaborator.collaboratingTodos.pull(todoId);
    todo.collaborators.pull(collaboratorId);
    collaborator.save();
    todo.save();
    
    res.status(200).json(todo);
  } else if (!creator(userId, todo)) {
    res.status(403).send("Only creator of a todo can remove collaborators");
  } else {
    res.status(404).send("User or Todo of given id not found!");
  }
}

module.exports = {
  createToDo,
  deleteToDo,
  editToDo,
  editToDoPatch,
  getAllToDo,
  getParticularToDo,
  addCollaborator,
  removeCollaborator
};
