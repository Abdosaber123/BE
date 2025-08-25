import connectDB from "./DB/connction.js";
import authRouter from "./Module/auth/register/register.controller.js"
import userRouter from "./Module/user/user.controller.js"
import messageRouter from "./Module/Message/message.controller.js"
import fs  from 'fs';
import { generateToken, verfifyToken } from "./utils/token/verifyToken.js";
import { Token } from "./DB/Model/Token.js";
import rateLimit from "express-rate-limit";
export default function bootstra(app , express){
  const limit = rateLimit({
    windowMs : 2 * 60 * 1000,
    limit :5,
    handler: (req, res , next , options)=>{
      throw new Error(options.message , {cause:options.statusCode})
    },
    skipSuccessfulRequests:true
  })
  app.use(limit)
 app.use(express.json());   
 app.use("/uploads" , express.static("uploads"))
 app.use("/auth" , authRouter)
 app.use("/user" , userRouter)
 app.use("/message" , messageRouter)
 app.use( async (err , req , res , next) =>{
   if(req.file){
     fs.unlinkSync(req.file.path)
    }
 try {
  if(err.message === "jwt expired"){
    const oldToken = req.headers.token 
    const refreshToken = req.headers.refreshtoken2 
    // console.log(oldToken);
    // console.log(refreshToken);
    
    const {id} = verfifyToken(refreshToken)
   
    const userExists = await  Token.findOneAndDelete({token:refreshToken , user: id , type:"refresh"})
    if(!userExists){
      throw new Error("invalid refresh token" , {cause:404})
    }
    const accessToken = generateToken({
      payload:{id:userExists.user},
      options :{expiresIn:"2m"}
  })
  const newRefreshToken = generateToken({
    payload:{id:userExists.user},
    options :{expiresIn:"7d"}
})


 await Token.create({token:newRefreshToken , user:userExists.id , type:"refresh"})
return res.status(200).json({message:"User refresh successfully" , success:true , data:{accessToken , newRefreshToken}})
}
 } catch (error) {
  return res.status(error.cause || 500).json({message:error.message , stack:error.stack ,success:false})
 }
})
connectDB();
}
