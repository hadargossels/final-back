let mongoose=require("mongoose");
require('dotenv').config();

mongoose.connect(`mongodb+srv://HadarGossels:${process.env.MONGO_PASS}@cluster0.frvfb.mongodb.net/StoreDB?retryWrites=true&w=majority`,{  useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})

mongoose.connection.on("connected",()=>{
    console.log("mongo db connected");
})

// require('dotenv').config();
// const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://HadarGossels:${process.env.MONGO_PASS}@cluster0.frvfb.mongodb.net/StoreDB?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     console.log("hey")
//     if (err) console.log(err)
//     else {
//         console.log("connected");
//         const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();

//     }
  
// });
