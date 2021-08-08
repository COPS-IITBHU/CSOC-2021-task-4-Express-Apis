const { Router } = require("express");
const { ToDoController } = require("../controllers");
const {validate} = require("../utils");
const router = Router();

router.get("/", ToDoController.getAllToDo);
router.post("/create/",
validate.validateBody({
    title: "string"
}),ToDoController.createToDo);
router.use('/:id/',validate.validateParams);
router.get("/:id/", ToDoController.getParticularToDo);

router.patch("/:id/",
validate.validateBody({
    title: "string"
}),ToDoController.editToDoPatch);

router.put("/:id/",
validate.validateBody({
    title: "string"
}),ToDoController.editToDo);

router.delete("/:id/",ToDoController.deleteToDo);

router.patch("/:id/add-collaborator/",
validate.validateBody({
    collaborator: "string"
}),ToDoController.addCollaborator);

router.patch("/:id/remove-collaborator/",
validate.validateBody({
    collaborator: "string"
}),
ToDoController.removeCollaborator);
// TODO: Create the end points similarly

module.exports = router;
