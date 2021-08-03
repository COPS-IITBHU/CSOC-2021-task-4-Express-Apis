const { Router } = require("express");
const { ToDoController } = require("../controllers");
const router = Router();

router.get("/", ToDoController.getAllToDo);
router.get("/:id/", ToDoController.getParticularToDo);
router.post("/create/",ToDoController.createToDo);
router.patch("/:id/",ToDoController.editToDoPatch);
router.put("/:id/",ToDoController.editToDo);
router.delete("/:id/",ToDoController.deleteToDo);
// TODO: Create the end points similarly
