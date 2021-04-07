const router = require("express").Router();
const auth = require("../middleware/auth");
const { newPost } = require("../controllers/PostController");

//
router.post("/", auth, newPost);

module.exports = router;
