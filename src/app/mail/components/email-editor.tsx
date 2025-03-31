"use client";
import React from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { Text } from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import EditorMenubar from "./editor-menubar";

type Props = {};

const EmailEditor = (props: Props) => {
  const [value, setValue] = React.useState<string>("");

  const CustomText = Text.extend({
    addKeyBoardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Meta-j");
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, CustomText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  //Wait for the editor to initialise before displaying the Editor
  if(!editor) return null

  return (
    <div>
        <EditorMenubar editor={editor}/>
      <div className="prose w-full px-4">
        <EditorContent editor={editor} value={value} />
      </div>
    </div>
  );
};

export default EmailEditor;
