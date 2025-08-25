import multer, { diskStorage } from "multer";

export function fileUpload({allowdType = ["image/jpeg" , "image/png"] , folder} = {}){
    const storage = diskStorage({})
    const fileFilter = (req , file , cb)=>{
        if(allowdType.includes(file.mimetype)){
            cb(null , true)
        }else{
            cb(new Error("Invalid file type"))
        }
    }
    
    return multer({storage , fileFilter , limits:{fileSize:1024 * 1024 * 5}})
}
