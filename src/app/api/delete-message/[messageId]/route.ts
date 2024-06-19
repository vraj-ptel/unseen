import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  reqest: Request,
  { params }: { params: { messageId: string } }
) {
  await dbConnect();
  const messageId = params.messageId;
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const updatedUser = await UserModel.updateOne(
      { $or:[{_id: user._id },{email:user.email}]},
      {
        $pull: {
          messages: {
            _id: messageId,
          },
        },
      }
    );
    if(updatedUser.modifiedCount === 0){
        return Response.json(
            { success: false, message: "Message not found or already deleted" },
            { status: 404 }
          );
    }
    return Response.json({ success: true, message: "Message deleted" },{ status: 200 });
  } catch (error) {
    console.error("Error deleting message",error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
