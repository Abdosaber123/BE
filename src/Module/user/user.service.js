import { User } from "../../DB/Model/user.js"

import { verfifyToken } from "../../utils/token/verifyToken.js"
import fs from "fs"
import cloudinary from './../../utils/cload/cloadnari.config.js';
export const deleteUser = async (req , res , next) => {
 
     if(req.user.picture.public_id){
        await cloudinary.api.delete_resources_by_prefix(
            `uploads/${req.user._id}`
        )
        await cloudinary.api.delete_folder(`uploads/${req.user._id}`)
     }
         await User.deleteOne({_id:req.user._id})
        if(!req.user){
            throw new Error("User not found" , {cause:404})
        }
        res.status(200).json({message:"User deleted successfully" , success:true})
    
}
export const uploadFile = (req , res , next)=>{
    return res.status(200).json({message:"File uploaded successfully" , success:true })
}
export const uploadPicture = async (req , res , next)=>{
    console.log(req.user);
    // console.log(req.file);
    
    if(req.user.picture){
        fs.unlinkSync(req.user.picture)
       }
    const userExists = await User.findByIdAndUpdate(req.user._id , {picture:req.file.path} , {new:true})
    if(!userExists){ 
        throw new Error("User not found" , {cause:404})
    }
    res.status(200).json({message:"Picture uploaded successfully" , success:true , data:userExists})
}
export const uploadImgCloud = async (req , res , next)=>{
    const user = req.user
    const file = req.file
    if(!user){
        throw new Error("User not found" , {cause:404})
    }
    if(user.picture.public_id){
        await cloudinary.uploader.destroy(user.picture.public_id)
    }
    const{secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {
        folder: `uploads/${user._id}/picture`
    })
    await User.updateOne({_id:user._id},{picture:{secure_url , public_id}})
    return res.status(200).json({message:"Picture uploaded successfully" , success:true , data :{secure_url , public_id}})
}