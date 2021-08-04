const { Router } = require("express");
const { ToDoController } = require("../controllers");
const router = Router();

router.get("/", ToDoController.getAllToDo);
router.get("/:id/", ToDoController.getParticularToDo);
router.post("/create/",ToDoController.createToDo);
router.patch("/:id/",ToDoController.editToDoPatch);
router.put("/:id/",ToDoController.editToDo);
router.delete("/:id/",ToDoController.deleteToDo);
router.patch("/:id/add-collaborators/",ToDoController.addCollaborators);
// TODO: Create the end points similarly

module.exports = router;
