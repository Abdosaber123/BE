import express from "express";
import bootstra from "./app.controller.js";
import dotenv from "dotenv"
dotenv.config({path: "../config/local.env"})
import schedule from "node-schedule"
import { User } from "./DB/Model/user.js";
import { deleteCloud } from "./utils/cload/cloadnari.config.js";
import { Message } from "./DB/Model/Message.js";
schedule.scheduleJob("1 28 16 * * *" , async ()=>{
  const users = await User.find({deleteAt: {$lte : Date.now() - 3 * 30 * 24 * 60 * 60 * 1000}}) /// delete after 3month
  for (const user of users ){
    if(user.picture.public_id)
      await  deleteCloud(`uploads/${user.id}`)
  }
 await User.deleteMany({deleteAt : {$lte :Date.now() - 3 * 30 * 24 * 60 * 60 * 1000}}) // delete after 3month
 await Message.deleteMany({receiver:{$in:users.map((user)=>{user._id})}})
 console.log('delete Succsses');
 
})
const app = express();
const port = process.env.PORT;
bootstra(app , express);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

