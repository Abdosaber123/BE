import { model, Schema } from "mongoose";

const scheman = new Schema({
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required: function(){
            if(this.attachments.leangth > 0){
                return false
            }
            return true
        }
    },
    attachments:[{
        secure_url:String,
        public_id:String
    }],
    sender:{
         type:Schema.Types.ObjectId,
        ref:"User"
    }
    
},{timestamps:true})
export const Message = model("Message" , scheman)