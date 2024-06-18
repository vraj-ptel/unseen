import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/apiResponse';


const transporter = nodemailer.createTransport({
    
    service:'gmail',
   
    auth: {
        user: 'vraz.tamp@gmail.com',
        pass: process.env.PASS
    }
});

export async function sendVerificationEmail(
    email:string,
    userName:string,
    verifyCode:string
):Promise<ApiResponse>{
    try{
        const info = await transporter.sendMail({
            from: "vraz.tamp@gmail.com", // Replace with your email address
            to: email,
            subject: 'Verification Email',
            html: render(VerificationEmail({userName,verifyCode})),
        });
        return {
            success: true,
            message: 'Verification email sent successfully',
        };
    }
    catch(emailError){
        console.log("emailError",emailError);
        return {success:false,message:"failed to send email"}
    }
}