import { Router } from "express";
import { fileUpload } from "../../utils/fileupload/index.js";
import { getMessage, messageSend } from "./message.validation.js";
import { validateToken } from "../../utils/isValidation/index.js";

const router = Router()
router.post("/:receiver", fileUpload().array("attachments" , 2),messageSend) // hna m4 4rt ab3t sender lel user
router.post("/:receiver/sender",validateToken ,fileUpload().array("attachments" , 2),messageSend) // hna 34an ab3te el sender lel user
router.get("/:id" , validateToken , getMessage)
export default router