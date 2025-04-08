// File: src/app/api/chat/route.ts

import { randomUUID } from "crypto";
import { type Message, streamText } from "ai";
import { NextResponse } from "next/server";
import { OramaClient } from "@/lib/orama";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { getSubscriptionStatus } from "@/lib/stripe-actions";
import { FREE_CREDITS_PER_DAY } from "@/app/constants";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    // --- Authentication and Rate Limiting ---
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, accountId }: { messages: Message[]; accountId: string } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    if (!accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 });
    }

    // --- Context Retrieval ---
    const oramaManager = new OramaClient(accountId);
    await oramaManager.initialise();
    const lastMessage = messages[messages.length - 1];

    if (lastMessage!.role !== "user") {
      return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
    }

    const context = await oramaManager.vectorSearch({
      term: lastMessage!.content,
    });

    console.log(context.hits.length + " hits found for context");

    // --- Construct Prompt/Messages for Gemini ---
    const systemPrompt = `You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by answering questions, providing suggestions, and offering relevant information based on the context of their previous emails.

THE TIME NOW IS ${new Date().toLocaleString()}

START CONTEXT BLOCK
${context.hits.map((hit: { document: any }) => JSON.stringify(hit.document)).join("\n")}
END OF CONTEXT BLOCK

When responding, please keep in mind:
- Be helpful, clever, and articulate.
- Rely on the provided email context to inform your responses.
- If the context does not contain enough information to answer a question, politely say you don't have enough information.
- Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
- Do not invent or speculate about anything that is not directly supported by the email context.
- Keep your responses concise and relevant to the user's questions or the email being composed.`;

    const messagesForApi = [
      { id: `sys_${randomUUID()}`, role: "system" as const, content: systemPrompt },
      ...messages,
    ];

    // --- Call Gemini API via ai-sdk's streamText ---
    const geminiStream = await streamText({
      model: google("gemini-1.5-flash"),
      messages: messagesForApi,
    });

    // Convert the stream to a proper Response
    return new Response(geminiStream.toDataStream(), {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: error.message || "An internal server error occurred" },
      { status: error.status || 500 }
    );
  }
}