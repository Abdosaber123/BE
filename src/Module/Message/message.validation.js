import { Message } from "../../DB/Model/Message.js"
import { uploadFiles } from "../../utils/cload/cloadnari.config.js"
import Joi from "joi";
export const messageSend = async  (req , res , next)=>{
    const {content} = req.body
    const {receiver} = req.params
    const {files} = req
    const schema = Joi.object({
        receiver: Joi.string().hex().length(24).required(),
        content: Joi.string().required().min(3).max(1000),
        sender: Joi.string().hex().length(24),
    })
    let data = {...req.body , ...req.params}
     const {error , value} = schema.validate(data)
    if(error){
        let errMsg = error.details.map((item)=>{return item.message})
        errMsg = errMsg.join(" , ")
        throw new Error(errMsg , {cause:400})
    }
 const attachments = await uploadFiles({files , options:{folder:`upload/${receiver}/message`}})
await Message.create({
    content,
    receiver,
    attachments,
    sender:req.user?._id
 })
 return res.status(200).json({message:"Message sent successfully" , success:true})
}
export const getMessage = async (req , res , next)=>{
    const {id} = req.params
    const schema = Joi.object({
        id: Joi.string().hex().length(24).required(),
    })
    let data = {...req.params}
     const {error , value} = schema.validate(data)
    if(error){
        let errMsg = error.details.map((item)=>{return item.message})
        errMsg = errMsg.join(" , ")
        throw new Error(errMsg , {cause:400})
    }
    const messages = await Message.findOne({_id:id , receiver:req.user._id} , {} , {populate:{path:"receiver" , select: "-password -creadetialUpdate -deleteAt -age -email -fullName -phone -picture"}})
    if(!messages){
        throw new Error("Message not found" , {cause:404})
    }
    return res.status(200).json({message:"Messages retrieved successfully" , success:true , data:messages})

}