import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";

const userNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(req: NextRequest) {
  if (req.method !== "GET"){
    return new Response("Method Not Allowed", { status: 405 });
  }
    
  await dbConnect();

  try {
    // getting query params from the url
    const { searchParams } = new URL(req.url);

    const queryParams = {
      userName: searchParams.get("userName"),
    };

    // validating the query params with zod
    const result = userNameQuerySchema.safeParse(queryParams);

    console.log("result", result);
    // if the query result is not valide return error
    if (!result.success) {
      // console.log(result.error.format())
      const userNameErrors = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors.length > 0
              ? userNameErrors.join(" ")
              : "invalid Query Params",
        },
        { status: 400 }
      );
    }
    // if the query result is valide
    const { userName } = result.data;

    const user = await UserModel.findOne({ userName, isVerified: true });
    if (user) {
      return Response.json(
        { success: false, message: "username is aleready taken" },
        { status: 404 }
      );
    } else {
      return Response.json(
        { success: true, message: "username is correct" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("error Checking userName", error);
    return Response.json(
      { success: false, message: "error Checking userName" },
      { status: 500 }
    );
  }
}
