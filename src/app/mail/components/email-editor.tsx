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
  
  defaultToolbarExpanded: boolean;
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
  const [value, setValue] = React.useState("");
  const [expanded, setExpanded] = React.useState(defaultToolbarExpanded);
  const { theme } = useTheme();
  
  const CustomText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Meta-j");
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
  
  //Wait for the editor to initialise before displaying the Editor
  if (!editor) return null;
  
  return (
    <div className="flex flex-col rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-[#1D2B64]/90 dark:to-[#F8CDDA]/90">
      <div className="p-4 bg-gradient-to-r from-[#1D2B64]/10 to-[#F8CDDA]/10 dark:from-[#1D2B64]/30 dark:to-[#F8CDDA]/30">
        {expanded && (
          <>
            <div className="mb-4">
              <TagInput
                placeholder="To"
                value={toValues}
                onChange={setToValues}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            
            <div className="mb-4">
              <TagInput
                placeholder="cc"
                value={ccValues}
                onChange={setCcValues}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            
            <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
            
            <div className="mb-4">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="text-[#1D2B64] dark:text-[#F8CDDA] hover:bg-[#1D2B64]/10 dark:hover:bg-[#F8CDDA]/10"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            "Hide details"
          ) : (
            <>
              Draft to {to.join(", ")}
            </>
          )}
        </Button>
      </div>
      
      <Separator className="bg-gray-200 dark:bg-gray-700" />
      
      <div className="p-4 bg-white dark:bg-gray-800 flex-grow">
        <EditorMenubar editor={editor} />
        
        <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />
        
        <div className="prose dark:prose-invert max-w-none mt-4 focus:outline-none">
          <EditorContent editor={editor} className="min-h-[200px] focus:outline-none" />
        </div>
      </div>
      
      <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#1D2B64]/10 to-[#F8CDDA]/10 dark:from-[#1D2B64]/30 dark:to-[#F8CDDA]/30">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center">
            Tip: Press{" "}
            <kbd className="mx-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
              Cmd/Ctrl + J
            </kbd>
            {" "}for AI to autocomplete
          </span>
        </div>
        
        <Button 
          className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] hover:from-[#1D2B64]/90 hover:to-[#F8CDDA]/90 text-white"
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