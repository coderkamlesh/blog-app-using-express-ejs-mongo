const mongoose=require("mongoose");

// comment Schema

const commentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    message:{
        type:String,
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post" ,
        required:true,
    }
},{
    timestamps:true,
})

//model
const Comment=mongoose.model("Comment",commentSchema);
module.exports=Comment;