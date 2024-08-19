import { checkApiLimit, increaseAPiLimit } from "@/lib/api-limits";
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
          role: "user",
          content: `
                Be professional Police Report writer.
                Write an incident report using only information given below. 
                Make sure to use the provided format, and any information that is not mentioned in the text given below.
                Please indicate in a paragraph at the end. 
                Please provide a detailed account of the incident, including the following information:
                Note: Strictly follow the format and be to the point while providing details. Don't add additional details by yourself.
                Format: 
                • Date and Time: When did the incident occur?
                • Location: Where did the incident take place?
                • Involved Parties: Who was involved? Include names, descriptions, and roles (e.g., victim, suspect, witness).
                • Sequence of Events: Describe what happened in chronological order. Include your observations and actions taken.
                • Statements: Summarize any statements made by involved parties and witnesses.
                • Evidence: Describe any evidence collected at the scene (e.g., physical evidence, photographs, video footage).
                • Injuries and Damages: Note any injuries sustained and damages observed.
                • Resolution: What was the outcome of the incident? Include any arrests made, citations issued, and reports filed.
                • Officer Actions: Detail any actions you took during the incident, including interactions with involved parties and other officers.
                • Body cam: Was a body cam used?
                • Additional Info: If any?
                `,
        },
        { role: "user", content: prompt },
      ],
    });
    if (!isPro) {
      await increaseAPiLimit();
    }

    console.log(response);
    return NextResponse.json(response.choices[0].message, { status: 200 });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
