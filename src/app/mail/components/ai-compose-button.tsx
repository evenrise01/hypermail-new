"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "./action";
import { readStreamableValue } from "ai/rsc";
import useThreads from "@/hooks/use-threads";
import { turndown } from "@/lib/turndown";

type Props = {
  isComposing?: boolean;
  onGenerate: (token: string) => void;
  onComplete?: () => void; // Add this for completion handling
};

const AIComposeButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { threads, threadId, account } = useThreads();

  const thread = threads?.find((t) => t.id === threadId);

  const aiGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    let context = "";
    // console.log("Starting AI generation with prompt:", prompt);

    if (!props.isComposing) {
      for (const email of thread?.emails ?? []) {
        const content = `
            Subject: ${email.subject}
            From: ${email.from}
            SentAt: ${new Date(email.sentAt).toLocaleString()}
            Body: ${turndown.turndown(email.body ?? email.bodySnippet ?? "")}
            `;
        context += content;
      }
    }

    context += `
    My name is ${account?.name} and my email is ${account?.emailAddress}
    `;

    // console.log("Context: ",context)
    try {
      const { output } = await generateEmail(context, prompt);
      console.log("Received output from API:", output);

      // Handle potential undefined output
      if (!output) {
        throw new Error("No output received from the Gemini API");
      }

      for await (const token of readStreamableValue(output)) {
        console.log("Streaming token:", token);
        if (token) {
          props.onGenerate(token);
        }
      }

      // Call completion handler if provided
      if (props.onComplete) {
        props.onComplete();
      }
    } catch (error) {
      console.error("Error generating email:", error);
      props.onGenerate("Error: Could not generate email. Please try again.");
    } finally {
      console.log("AI generation complete.");
      setLoading(false);
      setOpen(false);
      setPrompt("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(true)}
          aria-label="AI Compose"
        >
          <Bot className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Smart Compose</DialogTitle>
          <DialogDescription>
            AI will help you compose your email based on your prompt.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the email you want to write (e.g., 'Polite follow-up to client about overdue payment')"
          disabled={loading}
          className="min-h-[120px]"
        />
        <div className="h-2"></div>
        <Button
          onClick={aiGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Email"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AIComposeButton;
