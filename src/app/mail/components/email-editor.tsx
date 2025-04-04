"use client";
import React from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { Text } from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import EditorMenubar from "./editor-menubar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TagInput from "./tag-input";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import AIComposeButton from "./ai-compose-button";
import { generate } from "./action";
import { readStreamableValue } from "ai/rsc";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Loader2, Send } from "lucide-react";
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
  const [value, setValue] = React.useState<string>("");
  const [expanded, setExpanded] = React.useState(
    defaultToolbarExpanded ?? false,
  );
  const [token, setToken] = React.useState<string>("");
  const { theme } = useTheme();
  const editorContainerRef = React.useRef<HTMLDivElement>(null);

  const aiGenerate = async (value: string) => {
    const { output } = await generate(value);
    for await (const token of readStreamableValue(output)) {
      if (token) {
        setToken(token);
      }
    }
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

  React.useEffect(() => {
    editor?.commands?.insertContent(token);
  }, [editor, token]);

  const onGenerate = (token: string) => {
    editor?.commands?.insertContent(token);
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    // Only focus if clicking on the editor container, not on a button or other element
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
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
      <div className="relative z-10 p-4">
        {expanded && (
          <>
            <div className="relative z-30 mb-4">
              <TagInput
                placeholder="To"
                value={toValues}
                onChange={setToValues}
                className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            <div className="relative z-20 mb-4">
              <TagInput
                placeholder="cc"
                value={ccValues}
                onChange={setCcValues}
                className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

            <div className="mb-4">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#1D2B64] hover:bg-[#1D2B64]/10 dark:text-[#F8CDDA] dark:hover:bg-[#F8CDDA]/10"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide details" : <>Draft to {to.join(", ")}</>}
          </Button>
          <AIComposeButton
            isComposing={defaultToolbarExpanded}
            onGenerate={onGenerate}
          />
        </div>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      <div 
        ref={editorContainerRef}
        onClick={handleEditorClick}
        className="flex-grow bg-white p-4 dark:bg-gray-800 cursor-text"
      >
        <EditorMenubar editor={editor} />

        <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />

        <div className="prose dark:prose-invert mt-4 max-w-none focus:outline-none">
          <EditorContent
            editor={editor}
            className="min-h-[200px] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-gradient-to-r from-[#1D2B64]/10 to-[#F8CDDA]/10 p-4 dark:from-[#1D2B64]/30 dark:to-[#F8CDDA]/30">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center">
            Tip: Press{" "}
            <kbd className="mx-1 rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">
              Cmd/Ctrl+Alt+J
            </kbd>{" "}
            for AI to autocomplete
          </span>
        </div>

        <HoverBorderGradient
          containerClassName="rounded-md"
          as="button"
          onClick={async () => {
            editor?.commands?.clearContent();
            await handleSend(value);
          }}
          disabled={isSending}
          className="text-black dark:text-white"
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
        </HoverBorderGradient>
      </div>
    </div>
  );
};

export default EmailEditor;