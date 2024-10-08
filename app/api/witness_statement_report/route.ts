import { checkApiLimit, increaseAPiLimit } from "@/lib/api-limits";
import { saveHistoryReport } from "@/lib/history-reports";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;
    console.log(prompt);

    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }
    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key is Invalid", { status: 500 });
    }
    if (!prompt) {
      return new NextResponse("Prompt us required", { status: 400 });
    }

    const freeTrail = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrail && !isPro) {
      return new NextResponse("Free Trail has expired", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
                Task: Be a Professional Police Report writer and extract the following details from the user text given below.
                Task: Be accuarte while extracting the details given below
                Details: 
                • Date and Time: if any
                • Location: if any
                • Incident Description: if any (extract what was seen or heard in chronological order.)
                • Involved Parties: if any (extract the exact text from the report)
                • Your Role: if any (extract user relationship to the incident)
                • Observations: if any (extract details that may be relevant to the incident.)
                • Statements: if any (extract any statements made by involved parties or witnesses.)
                • Additional Details: if any (extract relevant details that may assist in the investigation.)
                • Body cam: if any (was a body cam used?)
                • Additional Info: If any?
                Format: Plain text that can be used for MSWord
                `,
        },
        { role: "user", content: prompt },
      ],
    });

    if (!isPro) {
      await increaseAPiLimit();
    }

    await saveHistoryReport(
      userId,
      `${Date.now()}`,
      response.choices[0].message.content || "",
      "witness"
    );

    console.log(response);
    return NextResponse.json(response.choices[0].message, { status: 200 });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
