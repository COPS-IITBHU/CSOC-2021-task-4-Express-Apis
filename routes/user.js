const { Router } = require("express");
const { UserController } = require("../controllers");
const {validate} = require("../utils");
const router = Router();

router.post("/login/",validate.validateBody({
    username: "string",
    password: "string"
}), UserController.login);
router.post("/signup",validate.validateBody({
    email: "string",
    password: "string",
    name: "string",
    username: "string"
}), UserController.signup);
router.get("/profile", UserController.profile);

module.exports = router;
