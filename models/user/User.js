const { default: mongoose } = require("mongoose");


//schema
const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileIMage:{
        type:String,
    },
    coverIMage:{
        type:String,
    },
    role:{
        type:String,
        default:"Blogger"
    },
    bio:{
        type:String,
        default:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum adipisci eligendi nobis itaque ex"
    },
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}]
},
{
    timestamps:true,
})

//compile to the schema to form a model
const User=mongoose.model("User",userSchema);

module.exports=User;
