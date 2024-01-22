const bcrypt=require("bcryptjs");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");



const registerCtrl=async(req,res,next)=>{
   
   const{fullname, email,password}=req.body;
   
      //check if field is empty
      if(!fullname || !email || !password){
         return res.render("users/register",{
            error:"All fields are required"
         })
      }
    try {
      //1.Check if user exist
      const userFound=await User.findOne({email});
      //2.throw an error
      if(userFound){
         return res.render("users/register",{
            error:"User already exists"
         })
      }else{
         //3.Hash password
         const salt=await bcrypt.genSalt(10);
         const hashedPassword=await bcrypt.hash(password,salt);
          //4.create user
         const user=await User.create({
            fullname, email,password:hashedPassword
         })
        //redirect
        res.redirect("/api/v1/users/profile-page")
      }
   } catch (error) {
      return res.render("users/register",{
         error:error.message
      })
    }
}

const loginCtrl=async(req,res,next)=>{
   const{email,password}=req.body;
   if(!email || !password){
      return res.render("users/login",{
         error:"All fields are required"
      })
   }

    try {
      //check if email exist
      const userFound=await User.findOne({email});
      if(!userFound){
         return res.render("users/login",{
            error:"user not exist please register first"
         })
      }

      //verify password
      const isPasswordValid=await bcrypt.compare(password,userFound.password);
      if(!isPasswordValid){
         return res.render("users/login",{
            error:"Wrong password"
         })
      }
      //save the user into
      req.session.userAuth=userFound._id;
      
       //redirect
    res.redirect("/api/v1/users/profile-page")
    } catch (error) {
      return res.render("users/login",{
         error:error.message
      })
    }
}

const userDetailsCtrl=async(req,res)=>{
   
    try {
      //get user id from params
      const userID=req.params.id;
      //find the user
      const user=await User.findById(userID);
       
       res.render("users/updateUser",{
         user,
         error:""
       })
    } catch (error) {
      return res.render("users/updateUser",{
         error:error.message
      })
    }
}

const profileCtrl=async(req,res)=>{
    try {
      //get the login user
      const userID=req.session.userAuth;

      //find the user
      const user=await User.findById(userID).populate("posts").populate("comments");
      
      res.render("users/profile",{user})
    } catch (error) {
      return res.render("users/profile",{
         error:error.message
      })
    }
}

const uploadProflePhoto=async(req,res,next)=>{
   
    try {
      //check file exist
      if(!req.file){
         
        return res.render("users/uploadProfilePhoto",{
            error:"Please upload image"
         })
      }
      //1.find the user to be updated
      const userId=req.session.userAuth;
      const userFound=await User.findById(userId);
      //2.check if user is not found
      if(!userFound){
         return res.render("users/uploadProfilePhoto",{
            error:"User not found"
         })
      }
      //3.update profile photo
      await User.findByIdAndUpdate(userId,{
         profileIMage:req.file.path
      },{
         new:true,
      })
       res.redirect("/api/v1/users/profile-page")
    } catch (error) {
      
      return res.render("users/uploadProfilePhoto",{
         error:error.message
      })
    }
}

const coverProfilePhoto=async(req,res)=>{
   try {
      //check file exist
      if(!req.file){
         
        return res.render("users/uploadCoverPhoto",{
            error:"Please upload image"
         })
      }
      //1.find the user to be updated
      const userId=req.session.userAuth;
      const userFound=await User.findById(userId);
      //2.check if user is not found
      if(!userFound){
         return res.render("users/uploadCoverPhoto",{
            error:"User not found"
         })
      }
      //3.update profile photo
      await User.findByIdAndUpdate(userId,{
         coverIMage:req.file.path
      },{
         new:true,
      })
       res.redirect("/api/v1/users/profile-page")
    } catch (error) {
      
      return res.render("users/uploadCoverPhoto",{
         error:error.message
      })
    }
}

const updatePasswordCtrl=async(req,res,next)=>{
   const{password}=req.body;
    try {
      //check if user is updating password
      if(password){
         const salt=await bcrypt.genSalt(10);
         const hashedPassword=await bcrypt.hash(password,salt);
         //update user
         await User.findByIdAndUpdate(req.session.userAuth,{
            password:hashedPassword
         },{
            new:true,
         })
         res.redirect("/api/v1/users/profile-page")
      }
      
      
    } catch (error) {
      return res.render("users/updatePassword",{
         error:error.message
      })
    }
}

const updateUserCtrl=async(req,res,next)=>{
   const{fullname,email}=req.body;

    try {
      if(!fullname || !email){
         return res.render("users/updateUser",{
            error:"please provide details",
            user:""
         })
      }
      //check if email is not taken
      if(email){
         const emailTaken=await User.findOne({email});
         if(emailTaken){
            return res.render("users/updateUser",{
               error:"Email is Taken",
               user:""
            })
         }
      }
      //update user
     await User.findByIdAndUpdate(req.session.userAuth,{
         fullname,email
      },{
         new:true,
      })

       res.redirect("/api/v1/users/profile-page")
    } catch (error) {
      return res.render("users/updateUser",{
         error:error.message,
         user:""
      })
    }
}

const logoutCtrl=async(req,res)=>{
   //destroy session
   req.session.destroy(()=>{
      res.redirect("/api/v1/users/login")
   })
}

module.exports={registerCtrl,loginCtrl,userDetailsCtrl,profileCtrl,uploadProflePhoto,coverProfilePhoto,updatePasswordCtrl,updateUserCtrl,logoutCtrl};