const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getUser,
  register,
  login,
  deleteUser,
} = require("../controllers/UserController");

// register an account
router.post("/register", register);

// login user
router.post("/login", login);

// get current user
router.get("/", auth, getUser);

// delete a user
router.delete("/", auth, deleteUser);

module.exports = router;
