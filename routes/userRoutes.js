const router = require("express").Router();
const { register } = require("../controllers/UserController");

router.post("/register", register);

module.exports = router;
