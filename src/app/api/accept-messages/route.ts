import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(reqest: Request) {
  await dbConnect();

    // taking user info from session
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authorized",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const email=user?.email;
  const { acceptMessage } = await reqest.json();
  
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        $or: [
          { email },
          { _id: userId },
        ]
      },
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );
   
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        { status: 500 }
      );
    }
    return Response.json(
        {
          success: true,
          message: "Message acceptance status updated successfully",
          updatedUser
        },
        { status: 200 }
      );

  } catch (error) {
    console.log("failed to update user status to accept messages",error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
    await dbConnect();
    const session=await getServerSession(authOptions);
    const user:User=session?.user as User;
    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"Not authorized"
            },
            {status:401}
        )
    }
    
    const userId=user?._id;
    const email=user?.email;
    try{
    const foundUser=await UserModel.findOne({
      $or: [
        { email},
        { _id:userId},
      ],
    });
    if(!foundUser){
        return Response.json(
            {
                success:false,
                message:"User not found"
            },
            {status:404}
        )
    }
    return Response.json(
        {
            success:true,
            isAcceptingMessage:foundUser.isAcceptingMessage,
            foundUser
        },
        {status:200}
    )}catch(error){
        console.log("failed to update user status to accept messages",error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 }
    );
    }
   
}