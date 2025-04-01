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
import { Bot, Loader2, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "./action";
import { readStreamableValue } from "ai/rsc";
import useThreads from "@/hooks/use-threads";
import { turndown } from "@/lib/turndown";
import { motion } from "framer-motion";

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
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] hover:from-[#1D2B64] hover:to-[#F8CDDA] border-none shadow-sm hover:shadow-md transition-all duration-300"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label="AI Compose"
          >
            <Bot className="size-5 text-white" />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="border-0 shadow-lg">
        <div className="absolute top-0 right-0 left-0 z-0 h-12 rounded-t-lg" />
        <DialogHeader className="relative z-10 pt-2">
          <DialogTitle className="flex items-center text-lg font-semibold mt-2 text-white dark:text-white">
            <Sparkles className="mr-2 size-5" />
            AI Smart Compose
          </DialogTitle>
          <DialogDescription className="text-gray-200 dark:text-gray-300">
            AI will help you compose your email based on your prompt.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the email you want to write (e.g., 'Polite follow-up to client about overdue payment')"
            disabled={loading}
            className="min-h-[120px] focus-visible:ring-[#1D2B64] border-gray-300 dark:border-gray-700"
          />
        </div>
        <div className="h-2"></div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            onClick={aiGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] hover:from-[#1D2B64] hover:to-[#F8CDDA] text-white font-medium border-none shadow-md hover:shadow-lg transition-all duration-300"
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
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AIComposeButton;