const express = require("express");
const multer = require("multer");
const {
  createPostCtrl,
  allPostListCtrl,
  singlePostDetailsCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const Post = require("../../models/post/Post");
const postRoutes = express.Router();

//instance of multer
const upload = multer({
  storage,
});

//forms
postRoutes.get("/get-post-form", (req, res) => {
  res.render("posts/addPost", { error: "" });
});

postRoutes.get("/get-form-update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", {
      post,
      error: "",
    });
  } catch (error) {
    res.render("posts/updatePost", {
      post: "",
      error,
    });
  }
});

//post///api/v1/posts
postRoutes.post("", protected, upload.single("file"), createPostCtrl);

//get///api/v1/posts
postRoutes.get("", allPostListCtrl);

//get///api/v1/posts
postRoutes.get("/:id", singlePostDetailsCtrl);

//delete///api/v1/posts
postRoutes.delete("/:id", protected, deletePostCtrl);

//update///api/v1/posts
postRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);

module.exports = postRoutes;
