import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {ApiResponse} from"@/types/apiResponse";

export async function sendVerificationEmail(
    email:string,
    userName:string,
    verifyCode:string
):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Verification Email',
            react: VerificationEmail({
              userName,
              verifyCode,
            }),
          });
        return {success:true,message:"email sent successfully"}

    }
    catch(emailError){
        console.log("emailError",emailError);
        return {success:false,message:"failed to send email"}
    }
}