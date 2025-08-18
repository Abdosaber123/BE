import jwt from "jsonwebtoken"
export function verfifyToken(token , sec = "sfgvslkfgsifjgskfgpjsfpjsfpsfg"){
    return jwt.verify(token , sec) 
}
export function generateToken({payload, secretkey = "sfgvslkfgsifjgskfgpjsfpjsfpsfg",options = {expiresIn :"15"}}){
   return jwt.sign(payload,secretkey,options)
}