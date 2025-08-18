import nodemailer from "nodemailer";
export default function sendMail({to , subject , html}){
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com" ,
        port:587,
        auth:{
            user:"blaza.cf0@gmail.com",
            pass:"mycxsetoroafshse"
        }
    });
    transporter.sendMail({
        from:"'sara7a App' <blaza.cf0@gmail.com>",
        to,
        subject,
        html,
    })
}