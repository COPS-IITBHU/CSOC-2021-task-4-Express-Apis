const { Router } = require("express");
const { UserController } = require("../controllers");

const router = Router();

const { requireAuth } = require('../middleware/verify')


router.post("/login/", UserController.login);
router.post("/signup", UserController.signup);
router.get("/profile", requireAuth, UserController.profile);

module.exports = router;
