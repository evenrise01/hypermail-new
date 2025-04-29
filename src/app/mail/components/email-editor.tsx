"use client";

import React, { useState, useRef, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Text } from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import EditorMenubar from "./editor-menubar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TagInput from "./tag-input";
import { Input } from "@/components/ui/input";
import AIComposeButton from "./ai-compose-button";
import { generate } from "./action";
import { readStreamableValue } from "ai/rsc";
import { ChevronDown, ChevronUp, Loader2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  subject: string;
  setSubject: (value: string) => void;
  toValues: { label: string; value: string }[];
  setToValues: (value: { label: string; value: string }[]) => void;
  ccValues: { label: string; value: string }[];
  setCcValues: (value: { label: string; value: string }[]) => void;
  to: string[];
  handleSend: (value: string) => void;
  isSending: boolean;
  defaultToolbarExpanded?: boolean;
};

const EmailEditor = ({
  ccValues,
  defaultToolbarExpanded,
  handleSend,
  isSending,
  setCcValues,
  setSubject,
  setToValues,
  subject,
  to,
  toValues,
}: Props) => {
  const [value, setValue] = useState<string>("");
  const [expanded, setExpanded] = useState(defaultToolbarExpanded ?? false);
  const [token, setToken] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const aiGenerate = async (value: string) => {
    setIsAITyping(true);
    const { output } = await generate(value);
    for await (const token of readStreamableValue(output)) {
      if (token) {
        setToken(token);
        // Small delay to simulate AI typing
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
    }
    setIsAITyping(false);
  };

  const CustomText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Control-Alt-j": () => {
          aiGenerate(this.editor.getText());
          return true;
        },
        "Meta-Alt-j": () => {
          aiGenerate(this.editor.getText());
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, CustomText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  useEffect(() => {
    editor?.commands?.insertContent(token);
  }, [editor, token]);

  const onGenerate = (token: string) => {
    editor?.commands?.insertContent(token);
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    if (
      editorContainerRef.current &&
      e.target === editorContainerRef.current &&
      editor
    ) {
      editor.commands.focus();
    }
  };

  if (!editor) return null;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl transition-all duration-300",
        "border border-gray-100 dark:border-gray-800",
        "bg-white dark:bg-gray-900",
        "shadow-lg shadow-indigo-500/5 dark:shadow-indigo-500/10",
        isHovered ? "translate-y-[-2px]" : "",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header section with details toggle */}
      <div className="relative z-10 p-4">
        {expanded && (
          <>
            <div className="relative z-30 mb-3">
              <TagInput
                placeholder="To"
                value={toValues}
                onChange={setToValues}
                className={cn(
                  "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
                  "rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20",
                )}
              />
            </div>

            <div className="relative z-20 mb-3">
              <TagInput
                placeholder="cc"
                value={ccValues}
                onChange={setCcValues}
                className={cn(
                  "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
                  "rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20",
                )}
              />
            </div>

            <Separator className="my-3 bg-gray-100 dark:bg-gray-800" />

            <div className="mb-3">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={cn(
                  "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
                  "rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                )}
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1 font-medium",
                "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20",
                "transition-all duration-300",
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp size={16} className="text-indigo-500" />
                  <span>Hide details</span>
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="text-indigo-500" />
                  <span>Draft to {to.join(", ")}</span>
                </>
              )}
            </Button>
            <AIComposeButton
              isComposing={defaultToolbarExpanded}
              onGenerate={onGenerate}
            />
          </div>

          {/* Schedule later, add image and attachments functionality to be added later */}

          {/* {expanded && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                <Clock size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                <ImagePlus size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                <Paperclip size={16} />
              </Button>
            </div>
          )} */}
        </div>
      </div>

      <Separator className="bg-gray-100 dark:bg-gray-800" />

      {/* Editor section */}
      <div
        ref={editorContainerRef}
        onClick={handleEditorClick}
        className={cn(
          "flex-grow cursor-text px-5 py-4",
          "bg-white dark:bg-gray-900",
        )}
      >
        <div className="relative">
          <EditorMenubar editor={editor} />

          <Separator className="my-2 bg-gray-100 dark:bg-gray-800" />
        </div>

        <div
          className={cn(
            "prose dark:prose-invert mt-4 max-w-none focus:outline-none",
            "relative min-h-[200px]",
          )}
        >
          <EditorContent
            editor={editor}
            className="min-h-[200px] focus:outline-none"
          />

          {/* AI typing indicator */}
          {isAITyping && (
            <div className="absolute right-0 bottom-0 flex items-center gap-2 rounded-tl-lg bg-white/70 px-3 py-1 text-xs text-indigo-600 backdrop-blur-sm dark:bg-gray-900/70 dark:text-indigo-400">
              <Sparkles size={12} className="animate-pulse" />
              <span className="animate-pulse">AI writing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer section with send button */}
      <div
        className={cn(
          "flex items-center justify-between p-4",
          "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30",
          "border-t border-gray-100 dark:border-gray-800",
        )}
      >
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Sparkles size={14} className="mr-2 text-indigo-500" />
          <span className="inline-flex items-center">
            Press{" "}
            <kbd
              className={cn(
                "mx-1 rounded px-2 py-1 font-mono text-xs",
                "bg-white dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700",
                "shadow-sm",
              )}
            >
              Cmd/Ctrl+Alt+J
            </kbd>{" "}
            for AI Autocomplete
          </span>
        </div>
        <Button
          disabled={isSending}
          onClick={async () => {
            editor?.commands?.clearContent();
            await handleSend(value);
          }}
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmailEditor;
