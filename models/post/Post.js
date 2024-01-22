const { default: mongoose } = require("mongoose");

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
        enum:["React Js","HTML","Css","Node js","JavaScript","Other"],
    },
    image:{
        type:String,
        // required:true,
    },
    user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       required:true, 
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
},
{
    timestamps:true,
})

//compile schema to form model
const Post=mongoose.model("Post",postSchema);

module.exports=Post;