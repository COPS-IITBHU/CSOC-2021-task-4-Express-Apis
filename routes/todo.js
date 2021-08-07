const { Router } = require("express");
const { ToDoController } = require("../controllers");
const router = Router();

const { requireAuth, AuthTodoOperation, AuthCreateTodo, AuthColabPermissions } = require('../middleware/verify');

router.use(requireAuth)    // checks whether user is login

router.get("/",  ToDoController.getAllToDo);
router.post("/:id/",  AuthCreateTodo, ToDoController.createToDo);  // id of user

// TODO: Create the end points similarly


router.get("/:id/", ToDoController.getParticularToDo);   // id  of todo

router.patch("/:id/", AuthTodoOperation, ToDoController.editToDoPatch);     // id  of todo      
router.put("/:id/",  AuthTodoOperation, ToDoController.editToDo);          // id  of todo
router.delete("/:id/",  AuthTodoOperation, ToDoController.deleteToDo);        // id  of todo


// collabrators
router.patch("/:id/add-collaborators/",  AuthColabPermissions, ToDoController.addCollaborators);
router.patch("/:id/remove-collaborators/", AuthColabPermissions, ToDoController.removeCollaborators);


module.exports = router;
