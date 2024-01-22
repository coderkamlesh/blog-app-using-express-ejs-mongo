const express=require("express");
const { postCommentCtrl,commentDetailsCtrl,deleteCommentCtrl,updateCommentCtrl } = require("../../controllers/comments/comments");
const commentRoutes=express.Router();
const protected=require("../../middlewares/protected");


//post///api/v1/comments
commentRoutes.post("/:id",protected,postCommentCtrl)

//get///api/v1/comments:id
commentRoutes.get("/:id",commentDetailsCtrl)

//delete///api/v1/comments
commentRoutes.delete("/:id",protected,deleteCommentCtrl)

//update///api/v1/comments
commentRoutes.put("/:id",protected,updateCommentCtrl)

module.exports=commentRoutes;