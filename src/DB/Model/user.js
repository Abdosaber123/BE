import { model, Schema } from "mongoose";
const schema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:function(){
            if(this.phone){
                return false
            }
            return true
        },
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:function(){
            if(this.email){
                return false
            }
            return true
        },
        unique:true
    },
    dob:{
        type:Date,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:Number,
    },
    expireOtp:{
        type:Date,
    },
    picture:{
        secure_url:String,
        public_id:String
    },
    token:{
        type:String,
    }
},{timestamps:true , versionKey:false , toObject:{virtuals:true} , toJSON:{virtuals:true} }  ) 
schema.virtual("fullName").get(function(){
    return `${this.firstName} ${this.lastName}`
})
schema.virtual("fullName").set(function(value){
    const [firstName,lastName] = value.split(" ")
    this.firstName = firstName
    this.lastName = lastName
})
schema.virtual("age").get(function(){
    return new Date().getFullYear() - new Date(this.dob).getFullYear()
})

export const User = model("User", schema)