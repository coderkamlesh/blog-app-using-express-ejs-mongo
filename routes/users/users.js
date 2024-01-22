const express=require("express");
const multer = require("multer");
const { userDetailsCtrl,registerCtrl,loginCtrl,profileCtrl,uploadProflePhoto ,coverProfilePhoto,updatePasswordCtrl,updateUserCtrl,logoutCtrl} = require("../../controllers/users/users");
const userRoutes=express.Router();
const protected=require("../../middlewares/protected");
const storage = require("../../config/cloudinary");


//instace of multer
const upload=multer({storage})

//---------
//rendering forms
//---------
//Login form
userRoutes.get("/login",(req,res)=>{
    res.render("users/login",{
        error:''
    })
})

//Register Form
userRoutes.get("/register",(req,res)=>{
    res.render("users/register",{
        error:''
    })
})



//upload profile photo
userRoutes.get("/upload-profile-photo-form",(req,res)=>{
    res.render("users/uploadProfilePhoto",{
        error:""
    })
})

//upload cover photo
userRoutes.get("/upload-cover-photo-form",(req,res)=>{
    res.render("users/uploadCoverPhoto",{
        error:""
    })
})
//update user
userRoutes.get("/update-user-password",(req,res)=>{
    res.render("users/updatePassword",{error:""})
})


//api/v1/users/register
userRoutes.post("/register",registerCtrl)

//users/login
userRoutes.post("/login",loginCtrl)



//profile
userRoutes.get("/profile-page", protected, profileCtrl)

//profile-photoupload
userRoutes.put("/profile-photo-upload",protected, upload.single("profile"), uploadProflePhoto)

//cover-photo-upload/:id
userRoutes.put("/cover-photo-upload",protected,upload.single("cover"), coverProfilePhoto)

//update-password/:id
userRoutes.put("/update-password",updatePasswordCtrl)

//users/update/:id
userRoutes.put("/update",updateUserCtrl)

//logout
userRoutes.get("/logout",logoutCtrl)

//get/:id
userRoutes.get("/:id",userDetailsCtrl)




module.exports=userRoutes;