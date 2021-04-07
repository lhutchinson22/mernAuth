const Post = require("../models/postModel");

module.exports = {
  newPost: async (req, res) => {
    try {
      const newPost = new Post({
        title: req.body.title,
        text: req.body.text,
        authorId: req.user,
      });

      const successSave = await newPost.save();
      res.json(successSave);
    } catch (err) {
      res.send("error saving: " + err);
    }
  },
};
