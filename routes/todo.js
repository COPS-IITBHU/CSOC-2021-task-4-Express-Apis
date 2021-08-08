const { Router } = require("express");
const { ToDoController } = require("../controllers");
const authorized = require("../middleware/auth");
const router = Router();

router.use(authorized());

router.get("/", ToDoController.getAllToDo);
router.post("/create", ToDoController.createToDo);

router.route("/:id")
    .get(ToDoController.getParticularToDo)
    .put(ToDoController.editToDo)
    .patch(ToDoController.editToDoPatch)
    .delete(ToDoController.deleteToDo);

router.post("/:id/add-collaborators", ToDoController.addCollaborator);
router.post("/:id/remove-collaborators", ToDoController.removeCollaborator);

module.exports = router;
// TODO: Create the end points similarly
