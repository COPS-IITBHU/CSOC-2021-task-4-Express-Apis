const { Router } = require("express");
const { ToDoController } = require("../controllers");
const router = Router();

const { requireAuth, AuthTodoOperation, AuthCreateTodo, AuthColabPermissions } = require('../middleware/verify');


router.get("/", requireAuth, ToDoController.getAllToDo);
router.post("/:id/", requireAuth, AuthCreateTodo, ToDoController.createToDo);  // id of user

// TODO: Create the end points similarly


router.get("/:id/", requireAuth, ToDoController.getParticularToDo);   // id  of todo
// router.use(checkUser)
router.patch("/:id/", requireAuth, AuthTodoOperation, ToDoController.editToDoPatch);     // id  of todo      
router.put("/:id/", requireAuth, AuthTodoOperation, ToDoController.editToDo);          // id  of todo
router.delete("/:id/", requireAuth, AuthTodoOperation, ToDoController.deleteToDo);        // id  of todo


// collabrators
router.put("/:id/add-collaborators/", requireAuth, AuthColabPermissions, ToDoController.addCollaborators);
router.put("/:id/remove-collaborators/", requireAuth, AuthColabPermissions, ToDoController.removeCollaborators);


module.exports = router;


// Endpoints for collaborators

// Request Body Sample 
// {
//     "username":"<username of collaborator>"
// }


// Request Body Sample 
// {
//     "username":"<username of collaborator>"
// }