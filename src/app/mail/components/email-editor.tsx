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

  const aiGenerate = async (value: string) => {
    const { output } = await generate(value); //value - current things that the user is typing in the editor
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
          // Works on Windows/Linux (Ctrl+Alt+J)
          aiGenerate(this.editor.getText());
          return true;
        },
        "Meta-Alt-j": () => {
          // Works on Mac (Cmd+Alt+J)
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
    console.log(token);
    editor?.commands?.insertContent(token);
  };

  //Wait for the editor to initialise before displaying the Editor
  if (!editor) return null;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md dark:border-gray-700 dark:from-[#1D2B64]/90 dark:to-[#F8CDDA]/90">
      <div className="bg-gradient-to-r from-[#1D2B64]/10 to-[#F8CDDA]/10 p-4 dark:from-[#1D2B64]/30 dark:to-[#F8CDDA]/30">
        {expanded && (
          <>
            <div className="mb-4">
              <TagInput
                placeholder="To"
                value={toValues}
                onChange={setToValues}
                className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            <div className="mb-4">
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

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      <div className="flex-grow bg-white p-4 dark:bg-gray-800">
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

        <Button
          className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white hover:from-[#1D2B64]/90 hover:to-[#F8CDDA]/90"
          onClick={async () => {
            //On clicking send, clear the input
            editor?.commands?.clearContent();
            await handleSend(value);
          }}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default EmailEditor;
