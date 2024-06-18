import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userName, verifyCode } = await request.json();
    const decodedUserName = decodeURIComponent(userName);
    const user = await UserModel.findOne({ userName: decodedUserName ,isVerified:false});
    //    if user not found return 404
    if (!user) {
      return Response.json(
        { success: false, message: "userName does not found or user is already verified" },
        { status: 404 }
      );
    }

    //    if user found and get verified
    const isCodeVerified = user.verifyCode === verifyCode;
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeVerified && isCodeExpired) {
        user.isVerified=true;
        await user.save();
      return Response.json(
        { success: true, message: "user verified" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, message: "invalid verifyCode or expired verifyCode" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("error verifiying user", error);
    return Response.json(
      { success: false, message: "error verifying user" },
      { status: 500 }
    );
  }
}
