const { Router } = require("express");
const { ToDoController } = require("../controllers");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router();

router.use(authMiddleware);
router
  .route("/")
  .get(ToDoController.getAllToDo)
  .post(ToDoController.createToDo);
router
  .route("/:id")
  .get(ToDoController.getParticularToDo)
  .put(ToDoController.editToDo)
  .patch(ToDoController.editToDo)
  .delete(ToDoController.deleteToDo);
router.post("/:id/add-collaborators", ToDoController.addCollaborator);
router.post("/:id/remove-collaborators", ToDoController.removeCollaborator);

module.exports = router;
