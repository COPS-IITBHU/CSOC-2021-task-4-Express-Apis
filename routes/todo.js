const { Router } = require("express");
const { ToDoController } = require("../controllers");
const router = Router();

router.get("/", ToDoController.getAllToDo);
router.post("/:id/", ToDoController.createToDo);


// TODO: Create the end points similarly
router.get("/:id/", ToDoController.getParticularToDo);
router.put("/:id/", ToDoController.editToDo);
router.patch("/:id/", ToDoController.editToDoPatch);
router.delete("/:id/", ToDoController.deleteToDo);

router.post("/:id/add-collaborators/", ToDoController.addCollaborators);
router.delete("/:id/remove-collaborators/:username", ToDoController.removeCollaborators);

module.exports = router;