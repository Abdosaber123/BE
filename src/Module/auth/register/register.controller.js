import { Router } from "express";   
import { login, logout, refreshToken, register, resendOtp, resetPassword,  verifyEmail } from "./register.service.js";
import { fileUpload } from "../../../utils/fileupload/index.js";
import { handelError } from "../../../utils/handelError/index.js";
import { validateToken } from "../../../utils/isValidation/index.js";
 
const router = Router();
router.post("/register",fileUpload().none() , handelError(register))
router.post("/login" , login)
router.post("/verifyEmail" , verifyEmail)
router.post("/resendOtp" , resendOtp)
router.post("/refreshToken" , refreshToken)
router.patch("/resetPassword" , resetPassword)
router.post("/logout" , validateToken , logout)
export default router;