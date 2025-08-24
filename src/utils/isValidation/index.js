import { Token } from "../../DB/Model/Token.js";
import { User } from "../../DB/Model/user.js"
import { verfifyToken } from "../token/verifyToken.js"
import  joi  from 'joi';

export const validateToken = async (req , res , next)=>{ 
    const token = req.headers.authorization
    if(!token){
        throw new Error("plse check your token" ,{cause:400})
    }
    const blockedToken = await Token.findOne({token , type:"access"})
    if(blockedToken){
        throw new Error("token blocked" , {cause:400})
    }
    const {id , iat} = verfifyToken(token)
   
    
    const userExists = await User.findById(id)
    if(!userExists){
        throw new Error("user not defiend" , {cause:400})
    }
    if(userExists.creadetialUpdate > new Date(iat * 1000)){
        throw new Error("token expired" , {cause:401});
        
    }
    console.log({creadetialUpdate:userExists.creadetialUpdate ,iat: iat});
    
    req.user = userExists
    return next()
}


export const generalField = {
    name: joi.string().min(3).max(60),
    email:joi.string().email(),
    password:joi.string(),
    phone:joi.string(),
    dob:joi.date(),
    otp:joi.number(),
    rePassword:joi.string().valid(joi.ref("password"))
    
}