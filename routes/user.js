const { Router } = require("express");
const { UserController } = require("../controllers");
const authMiddleware = require("../middleware/authMiddleware");
const router = Router();

router.post("/login", UserController.login);
router.post("/signup", UserController.signup);
router.get("/profile", authMiddleware, UserController.profile);

module.exports = router;
