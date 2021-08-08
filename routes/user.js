const { Router } = require("express");
const { UserController } = require("../controllers");
const authorized = require("../middleware/auth");

const router = Router();

router.post("/login/", UserController.login);
router.post("/signup", UserController.signup);
router.get("/profile", authorized(), UserController.profile);

module.exports = router;
