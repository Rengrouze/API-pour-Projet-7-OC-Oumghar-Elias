const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/user");
const auth = require("../middleware/auth");
const bouncer = require("express-bouncer")(500, 3600000);
const multer = require("../middleware/multer-config");

router.get("/", usersControllers.hello);
router.get("/user:id", auth, usersControllers.getOne);
router.post("/signup", usersControllers.signup);
router.post("/login", bouncer.block, usersControllers.login);
router.put("/update", auth, multer, usersControllers.update);

module.exports = router;
