let mongoose=require("mongoose");
require('dotenv').config();

mongoose.connect(`mongodb+srv://hadarGossels:${process.env.MONGO_PASS}@cluster0.yd9lz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
{  useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})

mongoose.connection.on("connected",()=>{
    console.log("mongo db connected");
})
