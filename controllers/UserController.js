const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, passwordCheck, displayName } = req.body;

      // validation (need one conditional for email validation)
      if (!email || !password || !passwordCheck || !displayName)
        return res
          .status(400)
          .json({ msg: "Not all fields have been entered!" });

      if (password.length < 8)
        return res
          .status(400)
          .json({ msg: "Password needs to be at least 8 characters long!" });

      if (password !== passwordCheck)
        return res.status(400).json({ msg: "Password not match!" });

      const existingUser = await User.findOne({ email: email });

      if (existingUser)
        return res
          .status(400)
          .json({ msg: "An account with this email already exists!" });

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
        email,
        password: passwordHash,
        displayName,
      });

      const savedUser = await newUser.save();

      res.json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
