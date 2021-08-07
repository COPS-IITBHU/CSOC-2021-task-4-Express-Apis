const { ToDo, Token, User } = require("../models");



const getAllToDo = async (req, res) => {
  
  try {
    var token = req.headers.authorizations
    token = await Token.findOne({ token: token })
    if (!token) {
      return res.status(401).send('Wrong token')
    }
    const my_todo = await ToDo.find({createdBy:token.user})
    const collaborated_todo = await ToDo.find({collaborators: token.user})
    res.status(201).send({my_todo: my_todo, collaborated_todo: collaborated_todo})
  } catch (err) {
    res.status(401).send(err)
  }

};

const createToDo = async (req, res) => {
 
  try {
    var token = req.headers.authorizations
    token = await Token.findOne({ token: token })
    if (!token) {
      return res.status(401).send('Wrong token')
    }
    await ToDo({ title: req.body.title, createdBy: token.user })
      .save().then(() => { return res.status(201).send('Successfully added') })
  }
  catch (err) {
    return res.status(401).send(err)
  }
};

const getParticularToDo = async (req, res) => {
  try {
    var token = req.headers.authorizations
    token = await Token.findOne({ token: token })
    if (!token) {
      return res.status(401).send('Wrong token')
    }
    await ToDo.findOne({ _id: req.params.id })
      .then(data => { return res.status(201).send({ id: data._id, title: data.title }) })
  } catch (err) {
    res.status(401).send(err)
  }
};

const editToDo = async (req, res) => {
  try {
    var token = req.headers.authorizations
    token = await Token.findOne({ token: token })
    if (!token) {
      return res.status(401).send('Wrong token')
    }
    await ToDo.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title })
      .then(() => { return res.status(201).send({ id: req.params.id, title: req.body.title }) })
  } catch (err) {
    res.status(401).send(err)
  }
};

const editToDoPatch = async (req, res) => {
  try {
    var token = req.headers.authorizations
    token = await Token.findOne({ token: token })
    if (!token) {
      return res.status(401).send('Wrong token')
    }
    await ToDo.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title })
      .then(() => { return res.status(201).send({ id: req.params.id, title: req.body.title }) })
  } catch (err) {
    res.status(401).send(err)
  }
};

const deleteToDo = async (req, res) => {
  try {
    var token = req.headers.authorizations
    token = await Token.findOne({ token: token })
    if (!token) {
      return res.status(401).send('Wrong token')
    }
    await ToDo.deleteOne({ _id: req.params.id })
      .then(() => { return res.status(204).send('Successfully deleted') })
  } catch (err) {
    res.status(401).send(err)
  }
};

const addCollaborator = async (req, res) => {
  try {
    var token = req.headers.authorizations
    token = await Token.findOne({ token: token })
    if (!token) {
      return res.status(401).send('Wrong token')
    }
    var user = await User.findOne({ username: req.body.username })
    const todo = await ToDo.findById(req.params.id)
    if (!user) {
      return res.status(401).send('Incorrect collaborator username')
    }
    if (!todo) {
      return res.status(401).send('No todo found')
    }
    if(todo.createdBy !== token.user){
      return res.status(401).send('Collaborator managment can only done by creater of todo')
    }
    if(token.user === user._id){
      return res.status(401).send('You cannot add yourself as a collaborator')
    }
    await ToDo.findOneAndUpdate({ _id: req.params.id }, {$addToSet: { collaborators: user._id } })
    .then( () => {return res.status(200).send({ "Message": "User with the given username successfully added as collaborator." })})
  }
  catch (err) {
    res.status(401).send(err)
  }
}

const removeCollaborator = async (req, res) => {
  try {
    var token = req.headers.authorizations
    token = await Token.findOne({ token: token })
    if (!token) {
      return res.status(401).send('Wrong token')
    }
    var user = await User.findOne({ username: req.body.username })
    const todo = await ToDo.findById(req.params.id)
    if (!user) {
      return res.status(401).send('Incorrect collaborator username')
    }
    if (!todo) {
      return res.status(401).send('No todo found')
    }
    if(todo.createdBy !== token.user){
      return res.status(401).send('Collaborator managment can only done by creater of todo')
    }
    if(token.user === user._id){
      return res.status(401).send('You cannot remove yourself as a collaborator')
    }
    await ToDo.findOneAndUpdate({ _id: req.params.id }, { $pull: { collaborators: user._id } })
    .then( () => {return res.status(200).send({ "Message": "User with the given username successfully removed as collaborator." })})
  }
  catch (err) {
    res.status(401).send(err)
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
