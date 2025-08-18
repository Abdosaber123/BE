import { User } from "../../../DB/Model/user.js"
import bcrypt from "bcrypt"
import sendMail from "../../../utils/email/index.js"
import { generateOtp } from "../../../utils/otp/index.js"
import jwt from "jsonwebtoken"
import { generateToken, verfifyToken } from "../../../utils/token/verifyToken.js"
import  joi from 'joi';
import { generalField } from "../../../utils/isValidation/index.js"
import { comparePassword, hashPassword } from "../../../utils/hashPassword/index.js"
import { Token } from "../../../DB/Model/Token.js"
export const register = async (req, res, next) => {
    
        const { fullName, email, password, phone, dob } = req.body
        const schema = joi.object({
            fullName:generalField.name,
            email:generalField.email,
            password:generalField.password,
            phone:generalField.phone,
            dob:generalField.dob
        })
        const {error , value} = schema.validate(req.body)
        if(error){
            let errorMsg = error.details.map((item)=>{return item.message})
            errorMsg = errorMsg.join(" , ")
            throw new Error(errorMsg , {cause:400})
        }
        const userExists = await User.findOne({
            $or: [
                { $and: 
                    [
                        { email: { $ne: null } }, { email: { $exists: true } }, { email: email }
                    ],
                 }
                , { $and: [{ phone: { $ne: null } }, { phone: { $exists: true } }, { phone: phone }] }]
        })
        if (userExists) {
            throw new Error("User already exists", { cause: 400 })
        }
        const user = new User({
            fullName,
            email,
            password:bcrypt.hashSync(password , 10),
            phone,
            dob
        })
        const {expireOtp , otp} = generateOtp()
        user.otp = otp
        user.expireOtp = expireOtp
        await sendMail({
            to: email,
            subject: "Verify your email",
            html: `<p>your otp is ${otp}  </p>`
        })
        await user.save()
        res.status(201).json({ message: "User registered successfully", success: true })
    
}
export const verifyEmail = async (req , res , next) =>{
    try {
        const {otp,email} = req.body
        const userExists = await User.findOne({
        email,
        otp,
        expireOtp:{$gt:Date.now()}
        })
        
        
        if(!userExists){
        throw new Error("Invalid otp" , {cause:400})
        }
        userExists.isVerified = true
        userExists.otp = undefined
        userExists.expireOtp = undefined
        await userExists.save()
    return res.status(200).json({message:"User verified successfully" , success:true})
    } catch (error) {
        res.status(error.cause).json({message:error.message , success:false})
    }
}
export const resendOtp = async (req , res , next) => {
    try {
        const {email} = req.body
        const userExists = await User.findOne({email})
        if(!userExists){
            throw new Error("User not found" , {cause:404})
        }
        const { otp ,expireOtp}= generateOtp()
        await User.updateOne({email} , {
            otp,
            expireOtp
        })
        await sendMail({
            to:email,
            subject:"re-send your otp",
            html:`<p>your new otp is ${otp}  </p>`
        })
        return res.status(200).json({message:"Otp resend successfully" , success:true})
    } catch (error) {
        res.status(error.cause).json({message:error.message , success:false})
    }
}
export const login = async (req , res , next) => {
    try {
        const {email , password , phone} = req.body
        const user = await User.findOne({$or:[
            {$and:[
                {email:{ $ne: null }},
                {email:{ $exists: true }},
                {email:email}
            ]},
            {$and:[
                {phone:{ $ne: null }},
                {phone:{ $exists: true }},
                {phone:phone}
            ]}
        ]})
        if(!user){
            throw new Error("User not found" , {cause:404})
        }
        
        
        const isMatch = comparePassword(password , user.password)
        if(!isMatch){
            throw new Error("Invalid credentials" , {cause:400})
        }
        if(user.isVerified === false){
            throw new Error("User not verified" , {cause:400})
        }
        const accessToken = generateToken({
            payload:{id:user._id},
            options :{expiresIn:"2m"}
        })
        const refreshToken = generateToken({
            payload:{id:user._id},
            options :{expiresIn:"7d"}
        })
        await Token.create({token:refreshToken , user:user._id , type:"refresh"})
            
       
        await user.save()
        return res.status(200).json({message:"User logged in successfully" , success:true , data:{accessToken , refreshToken}})
    } catch (error) {
        return res.status(error.cause).json({message:error.message , success:false})
    }
}
export const refreshToken = async (req , res , next)=>{
    const {token} = req.body
    const user = await User.findOne({token})
    if(!user){
        throw new Error("User not found" , {cause:404})
    }
    const newToken = jwt.sign({
        id:user._id,
        name:user.fullName},
         "sfgvslkfgsifjgskfgpjsfpjsfpsfg",{expiresIn:"1h"}) 
    user.token = newToken
    await user.save()
    return res.status(200).json({message:"User Refresh Token Done" , success:true , data:{newToken}})
}
export const resetPassword =  async (req,res,next)=>{
    const {email , otp , newPassword} = req.body
    const userExists = await User.findOne({email})
    if(!userExists){
        throw new Error("User not found" , {cause:404})
    }
    if(userExists.otp != otp){
        throw new Error("Invalid otp" , {cause:400})
    }
    if(userExists.expireOtp < Date.now()){
        throw new Error("Otp expired" , {cause:400})
    }
    userExists.password = hashPassword(newPassword)
    await userExists.save()
    return res.status(200).json({message:"Password updated successfully" , success:true})
//     const {oldPassword , newPassword} = req.body
//     if(!oldPassword || !newPassword){
//         throw new Error("Please provide oldPassword and newPassword" , {cause:400})
//     }
//     const {id} = verfifyToken(req.headers.authorization)
//     const user = await User.findById(id)
//     if(!user){
//         throw new Error("User not found" , {cause:404})
//     }
//    const isMatch = bcrypt.compareSync(oldPassword , user.password)
//    if(!isMatch){
//     throw new Error("Invalid credentials" , {cause:400})
//    }
//    user.password = bcrypt.hashSync(newPassword , 10)
//    await user.save()
//    return res.status(200).json({message:"Password updated successfully" , success:true})
}
export const logout = async (req , res , next)=>{
    const token  = req.headers.authorization
    await Token.create({token , user : req.user._id})
    return res.status(200).json({message:"User logged out successfully" , success:true})
}
