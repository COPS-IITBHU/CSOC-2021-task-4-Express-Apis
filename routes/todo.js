const { Router } = require("express");
const { ToDoController } = require("../controllers");
const router = Router();

router.get("/", ToDoController.getAllToDo);
router.post("/:id/", ToDoController.createToDo);
router.get('/:id',ToDoController.getParticularToDo);
router.put('/:id/',ToDoController.editToDo);
router.patch('/:id/',ToDoController.editToDoPatch);
router.delete('/:id/',ToDoController.deleteToDo);
router.post('/:id/addCollaborator',ToDoController.addCollaborator)
router.post('/:id/removeCollaborator',ToDoController.removeCollaborator)

// TODO: Create the end points similarly
module.exports = router;
