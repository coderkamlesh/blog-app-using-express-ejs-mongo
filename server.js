require("dotenv").config();
const express=require("express");
const session=require("express-session");
const methodOverride=require("method-override")
const mongoStore=require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalErrHandler");
const Post = require("./models/post/Post");
const { truncatePost } = require("./utils/helper");
require("./config/dbConnect");
const app=express();


//helpers
app.locals.truncatePost=truncatePost;


//middlewares
//configure ejs
app.set("view engine","ejs");
//serve static file
app.use(express.static(__dirname+"/public"))
app.use(express.json()); //pass incoming data
app.use(express.urlencoded({extended:true})) //pass form data

//method override
app.use(methodOverride("_method"))

//session config
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    store:new mongoStore({
        mongoUrl:process.env.MONGO_URL,
        ttl:24*60*60  //1day
    })
}))

//save the login user into locals
app.use((req,res,next)=>{
    if(req.session.userAuth){
        res.locals.userAuth=req.session.userAuth;
    }else{
        res.locals.userAuth=null;
    }
    next();
})

//render home
app.get("/",async(req,res)=>{
    try {
        const posts=await Post.find().populate('user');
        res.render("index",{posts})
    } catch (error) {
        res.render("index",{error:error.message})
    }
})


//-------
//users Route
//-------
app.use("/api/v1/users",userRoutes);

//-------
//posts Route
//-------
app.use("/api/v1/posts",postRoutes);


//----------
//comments route
//---------
app.use("/api/v1/comments",commentRoutes);


//ErrorHandler middleware
app.use(globalErrHandler);

//listen server
const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is running.... on PORT ${PORT}`);
})