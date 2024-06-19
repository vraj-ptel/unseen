import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  // taking user info from session
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }
  // console.log(user);
  // to avoid string _id in aggrigation pipelne it can cause error
  const userId = new mongoose.Types.ObjectId(user?._id);
  const email=user?.email as string;

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          $or:[
            {_id: userId},
            {email}
          ]
          
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if(!user || user.length === 0){
        return Response.json(
            { success: false, message: "no messages found" },
            { status: 404 }
          );
    }else{
        return Response.json(
            { success: true,messages:user[0].messages },
            { status: 200 }
          );
    }
  } catch (error) {
    console.error("error getting message",error);
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 500 }
    );
  }
}
