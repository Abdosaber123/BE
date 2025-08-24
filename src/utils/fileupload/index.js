import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "fs"
export function fileUpload({allowdType = ["image/jpeg" , "image/png"] , folder} = {}){
    const storage = diskStorage({
        destination:(req , file , cb)=>{ 
            let dest = `uploads/${req.user?.id}/${folder}` // ana 7att ? 34an lma a3ml send message lel user m3ah wla la
            if(!fs.existsSync(dest)){
                fs.mkdirSync(dest ,{recursive:true})
            }
            cb(null , dest)
        },
        filename:(req , file , cb)=>{
            cb(null , nanoid(5)+"_"+ file.originalname)
        }
    })
    const fileFilter = (req , file , cb)=>{
        if(allowdType.includes(file.mimetype)){
            cb(null , true)
        }else{
            cb(new Error("Invalid file type"))
        }
    }
    return multer({storage , fileFilter})
}
