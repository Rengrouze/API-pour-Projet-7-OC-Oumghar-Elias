const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/user");
const auth = require("../middleware/auth");
const bouncer = require("express-bouncer")(500, 3600000);

router.get("/", usersControllers.hello);
router.post("/signup", usersControllers.signup);
router.post("/login", bouncer.block, usersControllers.login);
router.post("/update", auth, usersControllers.update);
router.get("/users", auth, usersControllers.getOne);

module.exports = router;
