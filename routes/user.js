const { Router } = require("express");
const { UserController } = require("../controllers");
const {middleware } = require("../middleware")
const router = Router();


router.post("/login/", UserController.login);
router.post("/signup", UserController.signup);
router.get("/profile", middleware.checkAuth,UserController.profile);

module.exports = router;