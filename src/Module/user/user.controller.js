import Router from "express";
import { deleteUser, uploadFile, uploadPicture , uploadImgCloud } from "./user.service.js";
import { fileUpload } from "../../utils/fileupload/index.js";
import { handelError } from "../../utils/handelError/index.js";
import { validateToken } from "../../utils/isValidation/index.js";
import { fileUpload as cloudUpload } from '../../utils/fileupload/cloud.js'
const router = Router();
router.delete("/delete" , validateToken ,deleteUser)
router.post("/upload-file",fileUpload().single("file"),uploadFile)
router.post("/upload-update" , validateToken ,fileUpload({folder : "sendPec"}).single("file"),handelError(uploadPicture))
router.post("/upload-cloud" , validateToken , cloudUpload().single("file"),handelError(uploadImgCloud))
export default router;