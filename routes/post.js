const express = require("express");
const router = express.Router();

const postControllers = require("../controllers/post");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, postControllers.getAllPosts);
router.post("/newpost", auth, multer, postControllers.postOnePost);
router.post("/newcomment", auth, multer, postControllers.postOneComment);
router.post("/like", auth, postControllers.like);
module.exports = router;
