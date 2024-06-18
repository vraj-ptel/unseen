'use server'
// import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai";
// import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// export async function POST(req: Request) {8
//   try {
//     // Extract the `prompt` from the body of the request
// const prompt =
//   "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     // Ask Google Generative AI for a streaming completion given the prompt
//     const response = await genAI
//       .getGenerativeModel({ model: "gemini-pro" })
//       .generateContentStream({
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//       });

//     // Convert the response into a friendly text-stream
//     const stream = GoogleGenerativeAIStream(response);

//     // Respond with the stream
//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     if (error instanceof GoogleGenerativeAIError) {
//       // OpenAI API error handling

//       const { name, message } = error;
//       return NextResponse.json({ name, message }, {status: 500});
//     } else {
//       // General error handling
//       console.error("An unexpected error occurred:", error);
//       throw error;
//     }
//   }
// }

// import { google } from "@ai-sdk/google";

'use server'

import { generateText, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
 const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});
const model = google("models/gemini-1.5-pro-latest");
import { createStreamableValue } from "ai/rsc";

const prompt =
"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

export async function generateMsg() {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model,
      prompt,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    // No need for stream.done() here
    stream.done();
  })();

  return { output: stream.value };
}

export async function POST(req:Request){
  try {
    const {text:suggestedMessages}=await generateText({
      model,
      prompt
    })
    return Response.json({suggestedMessages},{status:200});
  } catch (error) {
    console.log("error connectiong to google api",error);
    return Response.json({error},{status:500});
  }
}