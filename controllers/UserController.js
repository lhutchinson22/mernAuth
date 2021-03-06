require("dotenv").config();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Confirm = require("../models/confirmModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

      // we start here

      const confirmationToken = new Confirm({
        token: crypto.randomBytes(10).toString("hex"),
        authorId: newUser._id,
      });

      console.log(confirmationToken);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "authtestverify@gmail.com",
          pass: process.env.EPASS,
        },
      });

      const mailOptions = {
        from: "authtestverify@gmail.com",
        to: newUser.email,
        subject: "Thanks for signing up!",
        text: `Click to confirm http://localhost:3000/confirm_token/${confirmationToken.token}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            `Email was sent with: http://localhost:3000/confirm_token/${confirmationToken.token}!`
          );
        }
      });

      await confirmationToken.save();
      const savedUser = await newUser.save();
      res.json(savedUser);
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // validation
      if (!email || !password)
        return res
          .status(400)
          .json({ msg: "Not all fields have been entered!" });

      const user = await User.findOne({ email: email });

      if (!user)
        return res
          .status(400)
          .json({ msg: "No account with this email has been registered." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials!" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
        expiresIn: "24h",
      });

      res.json({
        token,
        user: {
          id: user._id,
          displayName: user.displayName,
          confirmed: user.confirmed,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user);
      res.json({
        displayName: user.displayName,
        id: user._id,
      });
    } catch (err) {
      res.send(err.response);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user);
      res.json(deletedUser);
    } catch (err) {
      res.send({ error: err });
    }
  },
};
