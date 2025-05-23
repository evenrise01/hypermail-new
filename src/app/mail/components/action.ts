"use server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createStreamableValue } from "ai/rsc";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateEmail(context: string, prompt: string) {
  console.log("generateEmail called with:", { context, prompt });
  const stream = createStreamableValue("");

  try {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
      You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by providing suggestions and relevant information based on the context of their previous emails.
      
      THE TIME NOW IS ${new Date().toLocaleString()}
      
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      
      USER PROMPT:
      ${prompt}
      
      When responding, please keep in mind:
      - Be helpful, clever, and articulate.
      - Always start the email with a greeting.
      - Rely on the provided email context to inform your response.
      - If the context does not contain enough information to fully address the prompt, politely give a draft response.
      - Avoid apologizing for previous responses.
      - Do not invent or speculate about anything not supported by the email context.
      - Keep your response focused and relevant.
      - Don't add fluff like 'Here's your email'.
      - Directly output the email, no need to say 'Here is your email' or anything like that.
      - No need to output subject.
      - Always end the email with a formal sign-off. Choose the correct sign-off based on the email context. If no context, use Sincerely, [Your Name]" or "Regards, [Your Name]. Here, [Your Name] should be taken from the email context. The name should be in Title Case.
      `,
    });

    let fullResponse = "";
    for await (const delta of textStream) {
      console.log("Streaming delta:", delta);
      fullResponse += delta;
      stream.update(fullResponse);
    }

  } catch (error) {
    console.error("Error in generateEmail:", error);
    stream.update("Error generating the email. Please try again.");
  } finally {
    console.log("Stream completed.");
    stream.done();
  }

  return { output: stream.value };
}

export async function generate(input: string) {
    const stream = createStreamableValue('');
    (async () => {
        const { textStream } = await streamText({
            model: google("gemini-1.5-flash"),
            prompt: `
            ALWAYS RESPOND IN PLAIN TEXT, no html or markdown.
            You are a helpful AI embedded in a email client app that is used to autocomplete sentences, similar to google gmail autocomplete
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            I am writing a piece of text in a notion text editor app.
            Help me complete my train of thought here: <input>${input}</input>
            keep the tone of the text consistent with the rest of the text.
            keep the response short and sweet. Act like a copilot, finish my sentence if need be, but don't try to generate a whole new paragraph.
            Do not add fluff like "I'm here to help you" or "I'm a helpful AI" or anything like that.

            Example:
            Dear Alice, I'm sorry to hear that you are feeling down.

            Output: Unfortunately, I can't help you with that.

            Your output is directly concatenated to the input, so do not add any new lines or formatting, just plain text.
            `,
        });

        for await (const delta of textStream) {
            stream.update(delta);
        }

        stream.done();
    })();

    return { output: stream.value };
}