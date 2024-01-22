const mongoose = require("mongoose");

// const connectDB=mongoose.connect("mongodb+srv://krishnaKamlesh:XXaujFApYvw2qtxK@cluster0.nwtm7oz.mongodb.net/fullstack-blog-app?retryWrites=true&w=majority").then(()=>{
//     console.log("mongoDB connected...");
// }).catch(err=>console.log(err));

//another way
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongoDB connected...");
  } catch (error) {
    console.log("connection failed ", error.message);
  }
};
connectDB();
module.exports = connectDB;
