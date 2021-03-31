const router = require("express").Router();
const { register, login } = require("../controllers/UserController");

// register an account
router.post("/register", register);

// login user
router.post("/login", login);
module.exports = router;
