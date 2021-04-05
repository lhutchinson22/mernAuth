const router = require("express").Router();
const auth = require("../middleware/auth");
const { register, login, getUser } = require("../controllers/UserController");

// register an account
router.post("/register", register);

// login user
router.post("/login", login);

// get user route
router.get("/", auth, getUser);

module.exports = router;
