const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

//Create post
const createPostCtrl = async (req, res, next) => {
  const { title, description, category, user, image } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost", {
        error: "All fields are required",
      });
    }
    //find the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //Create the post
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });
    //push the postcreated into the array of user's post
    userFound.posts.push(postCreated._id);
    //re save
    await userFound.save();

    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost", {
      error: error.message,
    });
  }
};

//all posts fetch
const allPostListCtrl = async (req, res, next) => {
  try {
    const allPosts = await Post.find().populate("comments").populate("user");
    res.json({
      status: "sucess",
      data: allPosts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//single post
const singlePostDetailsCtrl = async (req, res, next) => {
  try {
    //get the id from params
    const id = req.params.id;
    //find the post
    const post = await Post.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate("user");

    res.render("posts/postDetails", {
      post,
      error: "",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

const deletePostCtrl = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    //Check if the post belongs to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/postDetails", {
        error: "You are not authorized to delete this post",
        post,
      });
    }

    //delete post
    await Post.findByIdAndDelete(req.params.id);
    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/postDetails", {
      error: error.message,
      post: "",
    });
  }
};

const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //Check if the post belongs to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/updatePost", {
        error: "You are not authorized to updte this post",
        post: "",
      });
    }
    //check if user is updating image
    if (req.file) {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        {
          new: true,
        }
      );
    } else {
      //update post
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        {
          new: true,
        }
      );
    }

    //redirect
    res.redirect("/");
  } catch (error) {
    return res.render("posts/updatePost", {
      error: error.message,
      post: "",
    });
  }
};

module.exports = {
  createPostCtrl,
  allPostListCtrl,
  singlePostDetailsCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
