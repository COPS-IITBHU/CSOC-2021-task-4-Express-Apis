const { ToDo, User } = require("../models");
const BackendError = require("../utils/BackendError");

const isCreater = (todo, id) => todo.createdBy.toString() == id;
const isCollaborator = (todo, id) =>
  todo.collaborators
    .filter((user) => (user ? true : false))
    .some((userId) => userId.toString() == id);

const getAllToDo = async (req, res, next) => {
  try {
    const [createdTodos, collaboratedTodos] = await Promise.all([
      ToDo.find({ createdBy: req.user._id }).select("_id title"),
      ToDo.find({
        collaborators: req.user._id,
      }).select("_id title"),
      ,
    ]);
    res
      .status(200)
      .json({ created: createdTodos, collaborated: collaboratedTodos });
  } catch (err) {
    next(err);
  }
};

const createToDo = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (title == null) throw new BackendError(400, "Title is required");
    if (!title) throw new BackendError(400, "Title cannot be blank");
    const newTodo = new ToDo({ title, createdBy: req.user._id });
    await newTodo.save();
    res.status(200).json({ _id: newTodo._id, title });
  } catch (err) {
    next(err);
  }
};

const getParticularToDo = async (req, res, next) => {
  try {
    const { id: todoId } = req.params;
    const todo = await ToDo.findById(todoId);
    if (!todo) throw new BackendError(404, "No Todo with given ID");

    if (!isCreater(todo, req.user._id) && !isCollaborator(todo, req.user._id))
      return next(
        new BackendError(403, "You are not authorized to do this operation")
      );

    res.status(200).json({ _id: todo._id, title: todo.title });
  } catch (err) {
    if (err.message.match(/Cast to ObjectId failed/))
      return next(new BackendError(404, "Invalid Id"));
    next(err);
  }
};

const editToDo = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    const { title } = req.body;
    if (title == null) throw new BackendError(400, "Title is required");
    if (!title) throw new BackendError(400, "Title cannot be blank");
    const todo = await ToDo.findById(todoId);
    if (!todo) throw new BackendError(404, "No Todo with given ID");

    if (!isCreater(todo, req.user._id) && !isCollaborator(todo, req.user._id))
      return next(
        new BackendError(403, "You are not authorized to do this operation")
      );

    todo.title = title;
    await todo.save();
    res.status(200).json({ _id: todo._id, title: todo.title });
  } catch (err) {
    if (err.message.match(/Cast to ObjectId failed/))
      return next(new BackendError(404, "No Todo with given ID"));
    next(err);
  }
};

const deleteToDo = async (req, res) => {
  try {
    const { id: todoId } = req.params;
    const todo = await ToDo.findById(todoId);
    if (!todo) throw new BackendError(404, "No Todo with given ID");

    if (!isCreater(todo, req.user._id) && !isCollaborator(todo, req.user._id))
      return next(
        new BackendError(403, "You are not authorized to do this operation")
      );

    await ToDo.deleteOne({ _id: todoId });
    res.status(204).send();
  } catch (err) {
    if (err.message.match(/Cast to ObjectId failed/))
      return next(new BackendError(404, "Invalid Id"));
    next(err);
  }
};

const addCollaborator = async (req, res, next) => {
  try {
    const { id: todoId } = req.params;
    const { username } = req.body;
    if (username == null)
      throw new BackendError(400, "Collaborator Username is required");
    if (!username)
      throw new BackendError(400, "Collaboratod Username cannot be blank");
    const [todo, user] = await Promise.all([
      ToDo.findById(todoId),
      User.findOne({ username }),
    ]);
    if (!todo) throw new BackendError(404, "No Todo with given ID");
    if (!user) throw new BackendError(404, "No User with given username");
    if (user._id == req.user._id)
      throw new BackendError(
        400,
        "You cannot use your own username as collaborator username"
      );
    let perm1 = isCreater(todo, req.user._id);
    if (!perm1)
      return next(
        new BackendError(403, "You are not authorized to do this operation")
      );

    const newToDo = await ToDo.findByIdAndUpdate(todoId, {
      $push: { collaborators: user._id },
    });
    res.status(200).json({ _id: newToDo._id, title: newToDo.title });
  } catch (err) {
    if (err.message.match(/Cast to ObjectId failed/))
      return next(new BackendError(404, "Invalid Id"));
    next(err);
  }
};

const removeCollaborator = async (req, res, next) => {
  try {
    const { id: todoId } = req.params;
    const { username } = req.body;
    if (username == null)
      throw new BackendError(400, "Collaborator Username is required");
    if (!username)
      throw new BackendError(400, "Collaboratod Username cannot be blank");
    const [todo, user] = await Promise.all([
      ToDo.findById(todoId),
      User.findOne({ username }),
    ]);
    if (!todo) throw new BackendError(404, "No Todo with given ID");
    if (!user) throw new BackendError(404, "No User with given username");
    if (user._id == req.user._id)
      throw new BackendError(
        400,
        "You cannot use your own username as collaborator username"
      );
    let perm1 = isCreater(todo, req.user._id);
    if (!perm1)
      return next(
        new BackendError(403, "You are not authorized to do this operation")
      );

    const newToDo = await ToDo.findByIdAndUpdate(todoId, {
      $pull: { collaborators: user._id },
    });
    res.status(200).json({ _id: newToDo._id, title: newToDo.title });
  } catch (err) {
    if (err.message.match(/Cast to ObjectId failed/))
      return next(new BackendError(404, "Invalid Id"));
    next(err);
  }
};

module.exports = {
  createToDo,
  deleteToDo,
  editToDo,
  getAllToDo,
  getParticularToDo,
  addCollaborator,
  removeCollaborator,
};
