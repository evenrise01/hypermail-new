import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  CodepenIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

const EditorMenubar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null;
  }

  const formatButtons = [
    {
      icon: <Bold className="size-4" />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      canRun: () => editor.can().chain().focus().toggleBold().run(),
    },
    {
      icon: <Italic className="size-4" />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      canRun: () => editor.can().chain().focus().toggleItalic().run(),
    },
    {
      icon: <Strikethrough className="size-4" />,
      title: "Strikethrough",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      canRun: () => editor.can().chain().focus().toggleStrike().run(),
    },
    {
      icon: <Code className="size-4" />,
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
      canRun: () => editor.can().chain().focus().toggleCode().run(),
    },
  ];

  const headingButtons = [
    {
      icon: <Heading1 className="size-4" />,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      title: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Heading4 className="size-4" />,
      title: "Heading 4",
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: () => editor.isActive("heading", { level: 4 }),
    },
  ];

  const listButtons = [
    {
      icon: <List className="size-4" />,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: <Quote className="size-4" />,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
  ];

  const historyButtons = [
    {
      icon: <Undo className="size-4" />,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
      canRun: () => editor.can().chain().focus().undo().run(),
    },
    {
      icon: <Redo className="size-4" />,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
      canRun: () => editor.can().chain().focus().redo().run(),
    },
  ];

  return (
    <TooltipProvider>
      <ScrollArea className="w-full">
        <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-md border border-[#1D2B64]/10 dark:border-[#F8CDDA]/10 shadow-sm">
          <div className="flex items-center">
            {formatButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={button.isActive() ? "default" : "ghost"}
                    size="icon"
                    onClick={button.action}
                    disabled={button.canRun ? !button.canRun() : false}
                    className={
                      button.isActive() 
                        ? "bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white h-8 w-8 rounded-md"
                        : "h-8 w-8 rounded-md hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/10"
                    }
                  >
                    {button.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white border-none">
                  <p>{button.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="mx-1 h-6 bg-[#1D2B64]/20 dark:bg-[#F8CDDA]/20" />

          <div className="flex items-center">
            {headingButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={button.isActive() ? "default" : "ghost"}
                    size="icon"
                    onClick={button.action}
                    className={
                      button.isActive() 
                        ? "bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white h-8 w-8 rounded-md"
                        : "h-8 w-8 rounded-md hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/10"
                    }
                  >
                    {button.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white border-none">
                  <p>{button.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="mx-1 h-6 bg-[#1D2B64]/20 dark:bg-[#F8CDDA]/20" />

          <div className="flex items-center">
            {listButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={button.isActive() ? "default" : "ghost"}
                    size="icon"
                    onClick={button.action}
                    className={
                      button.isActive() 
                        ? "bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white h-8 w-8 rounded-md"
                        : "h-8 w-8 rounded-md hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/10"
                    }
                  >
                    {button.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white border-none">
                  <p>{button.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="mx-1 h-6 bg-[#1D2B64]/20 dark:bg-[#F8CDDA]/20" />

          <div className="flex items-center">
            {historyButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={button.action}
                    disabled={button.canRun ? !button.canRun() : false}
                    className="h-8 w-8 rounded-md hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/10"
                  >
                    {button.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white border-none">
                  <p>{button.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
};

export default EditorMenubar;