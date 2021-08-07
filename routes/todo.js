const { Router } = require("express");
const { ToDoController } = require("../controllers");
const {middleware } = require("../middleware");
const router = Router();

router.get("/",middleware.checkAuth, ToDoController.getAllToDo);
router.get("/:id/", middleware.checkAuth,ToDoController.getParticularToDo);
router.put("/:id/",middleware.checkAuth, ToDoController.editToDo);
router.patch("/:id/",middleware.checkAuth, ToDoController.editToDoPatch);
router.delete("/:id/",middleware.checkAuth, ToDoController.deleteToDo);
router.post("/create", middleware.checkAuth,ToDoController.createToDo);
router.post("/:id/add-collaborators/",middleware.checkAuth,ToDoController.addCollaborator);         //Route to add a collaborator to given todo    
router.post("/:id/remove-collaborators/",middleware.checkAuth,ToDoController.removeCollaborator);   //Route to remove a collaborator from given todo               

// TODO: Create the end points similarly



module.exports = router;