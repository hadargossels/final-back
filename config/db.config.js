let mongoose=require("mongoose");
require('dotenv').config();

mongoose.connect(`mongodb+srv://HadarGossels:${process.env.MONGO_PASS}@cluster0.frvfb.mongodb.net/StoreDB?retryWrites=true&w=majority`,{  useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})

mongoose.connection.on("connected",()=>{
    console.log("mongo db connected");
})

