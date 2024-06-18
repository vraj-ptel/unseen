import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  const { userName, content } = await req.json();
  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    // if user found

    // if user not accept messages

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user not accepting message",
        },
        { status: 403 }
      );
    }

    const newMessage: Message = { content, createdAt: new Date() } as Message;
    user.messages.push(newMessage as Message);

    await user.save();
    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error sending message",
      },
      { status: 500 }
    );
  }
}