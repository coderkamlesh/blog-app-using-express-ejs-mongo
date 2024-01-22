const Comment = require("../../models/comment/Comment");
const User=require("../../models/user/User");
const Post=require("../../models/post/Post");
const appErr = require("../../utils/appErr");

const postCommentCtrl=async(req,res,next)=>{
   const{message}=req.body;

    try {
      //find the post
      const post=await Post.findById(req.params.id);
      //create comment
      const comment=await Comment.create({
         user:req.session.userAuth,
         message,
         post:post._id
      })
      //push the comment to post
      post.comments.push(comment._id);
      //find the user
      const user=await User.findById(req.session.userAuth);
      //push comment into user
      user.comments.push(comment._id)
      //disable validation
      //re-save
      await post.save({validateBeforeSave:false})
      await user.save({validateBeforeSave:false})
      
      //  redirect
      res.redirect(`/api/v1/posts/${post._id}`)
    } catch (error) {
       next(appErr(error.message))
    }
}

const commentDetailsCtrl=async(req,res)=>{
    try {
      const comment=await Comment.findById(req.params.id)
      res.render('comments/updateComment',{
         comment,error:""
      })
    } catch (error) {
      res.render('comments/updateComment',{
         error:error.message,
      })
    }
}

//delete comment
const deleteCommentCtrl=async(req,res,next)=>{
   
   try {
      const comment=await Comment.findById(req.params.id)
      //Check if the post belongs to the user
      if(comment.user.toString()!==req.session.userAuth.toString()){
         return next(appErr("You can't delete another user comment",403))
      }

      //delete post
      await Comment.findByIdAndDelete(req.params.id);
      //  redirect
      res.redirect(`/api/v1/posts/${req.query.postId}`)
    } catch (error) {
      next(appErr(error.message))
    }
}


//update comment
const updateCommentCtrl=async(req,res,next)=>{
   const{message}=req.body;
   try {
     if(!message){
        next(appErr("All fields are required"))
     }
     //find the comment
     const comment=await Comment.findById(req.params.id)
     
     if(!comment){
      return next(appErr("comment not found"))
     }
     //Check if the comment belongs to the user
     if(comment.user.toString()!==req.session.userAuth.toString()){
        return next(appErr("You are not allowed to updte this post",403))
     }
     //update comment
     const updatedComment=await Comment.findByIdAndUpdate(req.params.id,{
        message:req.body.message,
     },{
        new:true,
     })

     //redirect
     //  redirect
     res.redirect(`/api/v1/posts/${req.query.postId}`)
    } catch (error) {
       next(appErr(error.message))
    }
}

module.exports={
    postCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
} 