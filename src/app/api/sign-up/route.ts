import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail2";
import { exists } from "fs";

export async function POST(request: Request) {
  // connect to the database
  await dbConnect();
  try {
    const { userName, email, password } = await request.json();

    // checking if user exists in the database with the same username

    const existingUserVerifiedByUserName = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (existingUserVerifiedByUserName) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    // checking if user exists in the database with the same email

    const existingUserVerifiedByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserVerifiedByEmail) {
      if(existingUserVerifiedByEmail.isVerified){
        return Response.json({success:false,message:"User already exists with this email"},{status:400})
      }
      else{
        const hashedPassword = await bcrypt.hash(password,10);
        existingUserVerifiedByEmail.password = hashedPassword;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
        existingUserVerifiedByEmail.isVerified=false;
        await existingUserVerifiedByEmail.save();
        // return Response.json({success:true,message:"User updated successfully"},{status:200})
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        userName,
        email,
        password:hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );
    if (emailResponse.success) {
      return Response.json(
        { success: true, message: "Verification email sent" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, message: emailResponse.message},
        { status: 500 }
      );
    }
  } 
  // if error occur 
  catch (error) {
    console.log("error registering user", error);
    return Response.json(
      { success: false, message: "error registering user" },
      { status: 500 }
    );
  }
}
