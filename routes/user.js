const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/user");
const auth = require("../middleware/auth");
const bouncer = require("express-bouncer")(500, 3600000);
const multer = require("../middleware/multer-config");

router.get("/", usersControllers.hello);

router.post("/signup", bouncer.block, usersControllers.signup);
router.post("/login", bouncer.block, usersControllers.login);
router.put("/update", auth, multer, usersControllers.update);
router.put("/delete", auth, usersControllers.delete);

module.exports = router;
