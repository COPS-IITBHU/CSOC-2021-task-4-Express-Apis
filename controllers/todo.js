const { ToDo, Token } = require("../models");

// All the given method require token.
// So be sure to check for it before doing any stuff
// HINT: Create a middleware for above :)

const getAllToDo = async (req, res) => {
    
  const user = req.user
  ToDo.find({$or: [{createdBy:user._id},{collaborators:user._id}]},{title:1,createdBy:1},function(err,foundTodos){
    if(!err && foundTodos.length > 0){

      let todosOfUser=[]
      let todosCollaboratedTo=[]
      foundTodos.forEach(function(todo){
        if(todo.createdBy==user.id){
          todosOfUser.push({"id":todo._id,"title":todo.title})
        }else{
          todosCollaboratedTo.push({"id":todo._id,"title":todo.title})
        }
      })
      res.status(200).json({
        "todosOfUser":todosOfUser,
        "todosCollaboratedTo":todosCollaboratedTo
      })
    }else{
      res.status(200).json([])
    }
  
  })

  // Get the token in header.
  // Use the token to get all the ToDo's of a user
};

const createToDo = async (req, res) => {

  // Check for the token and create a todo
  // or throw error correspondingly
  const {title} = req.body
  const user = req.user
  console.log
  if(title.trim()==""){  //Checking if title is empty string(Only white space)
    return res.status(400).send("Title field cannot be empty.")
  }
  const todo = new ToDo({title:title,createdBy:user._id});
  todo.save(function(err,savedTodo){
    if(savedTodo){
    res.status(200).json({
      "id":todo._id,
      "title":todo.title})}else{
      res.status(400).send("Title field cannot be empty.")
    }
  })
};


const getParticularToDo = async (req, res) => {
  // Get the Todo of the logged in user with given id.
  const {id}=req.params
  const user=req.user

  ToDo.findOne({$or: [{_id:id,createdBy:user._id},{_id:id,collaborators:user._id}]},function(err,foundTodo){
    if(err) { console.log(err)}
    if(foundTodo){
        res.status(200).json({
          "id":foundTodo._id,
          "title":foundTodo.title})
    }else{
      res.status(400).send("Todo with the given id does not exist or you do not have the permission to access it.")
    }
    }) 
};



const editToDo = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response.
  const {id}=req.params
  const newTitle=req.body.title
  const user = req.user

  // Collaborators are not given permissions to send PUT requests as PUT request will replace the original TODO
  // which will also remove the collaborators from that TODO and also original creator of that TODO

  ToDo.findOneAndReplace({_id:id,createdBy:user._id},{title:newTitle,createdBy:user._id},{new:true},function(err,updatedTodo) {
    if(updatedTodo){
    if(!err){res.status(200).json({"id":updatedTodo.id,
                                   "title":updatedTodo.title})
    }else
    { 
      console.log(err)
      res.status(400).send("Error in updating todo.")} } 
    else res.status(400).send("Error in updating todo.")
  })

};      


                                                                                                       
const editToDoPatch = async (req, res) => {
  // Change the title of the Todo with given id, and get the new title as response
  const {id}=req.params
  const user=req.user
  ToDo.findOneAndUpdate({$or: [{_id:id,createdBy:user._id},{_id:id,collaborators:user._id}]},{$set:req.body},{new:true},function(err,updatedTodo){
    if(!err && updatedTodo){res.status(200).json({"id":updatedTodo.id,
                                   "title":updatedTodo.title})
    }else
    { res.status(400).send("Error in updating todo.")}  
  })
};



const deleteToDo = async (req, res) => {
  //  Delete the todo with given id
  
  const {id}=req.params
  const user = req.user
  ToDo.findOne({$or: [{_id:id,createdBy:user._id},{_id:id,collaborators:user._id}]},function (err, todo){

    if(todo){
      ToDo.deleteOne({_id:id},function(err){
        if(!err) res.status(200).send("Deleted the dodo successfully.")
        else { res.status(400).send("Error in deleting the todo.")}
      })
    }else{
      res.status(400).send("Wrong TODO id or you do not have the permission to delete the TODO.")
    }
  })
};


const addCollaborator = async (req, res) => {
  const { id } = req.params
  const { userid } = req.body
  const user = req.user
  ToDo.findOne({_id:id,createdBy:user._id},function (err, todo){
    if(!err && todo){

    if(todo.collaborators.includes(userid)){return res.status(200).send("This user is already a collaborator for the TODO.")}
    todo.collaborators.push(userid)
    todo.save()
    res.status(200).json({"Message":"User with the given id successfully added as collaborator.",
                          "TodoId":todo._id,
                          "TodoTitle":todo.title})
  }else{
    res.status(400).send("Error in adding collaborator.")
  }

  })

}

const removeCollaborator = async (req, res) => {
  const { id } = req.params
  const { userid }=req.body
  
  const user = req.user
  ToDo.findOne({_id:id,createdBy:user._id},function (err, todo){
    if(!err && todo){

    if(!todo.collaborators.includes(userid)){return res.status(200).send("The user you are tying to remove is already not a collaborator.")}
    ToDo.findOneAndUpdate({_id:id,createdBy:user._id},{$pull:{collaborators:userid}},function(err,updatedTodo){
      if(!err){
        res.status(200).json({"Message":"Collaborator removed successfully.",
                              "TodoId":updatedTodo._id,
                              "TodoTitle":updatedTodo.title})
      }else{
        res.status(400).send("Error in removing collaborator.")
      }
    })
  }else{
    res.status(400).send("Error in removing collaborator.")
  }

  })






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
