import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Pencil, Send, X, Sparkles } from "lucide-react";
import React from "react";
import EmailEditor from "./email-editor";
import { api } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";
import { toast } from "sonner";
import { motion } from "framer-motion";

type ComposeButtonProps = {
  isCollapsed: boolean;
};

const ComposeButton = ({ isCollapsed }: ComposeButtonProps) => {
  const [toValues, setToValues] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [ccValues, setCcValues] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [subject, setSubject] = React.useState<string>("");

  const sendEmail = api.account.sendEmail.useMutation()
  const { account } = useThreads()

  const handleSend = async (value: string) => {
    if(!account) return

    sendEmail.mutate({
      accountId: account.id,
      threadId: undefined,
      body: value,
      from: {name: account?.name ?? "Me", address: account.emailAddress ?? "me@example.com"},
      to: toValues.map(to => ({name: to.value, address: to.value})),
      cc: ccValues.map(cc => ({name: cc.value, address: cc.value})),
      replyTo: {name: account?.name ?? "Me", address: account.emailAddress ?? "me@example.com"},
      subject: subject,
      inReplyTo: undefined
    }, {
      onSuccess: () => {
        toast.success("Email sent successfully!")
      },
      onError: () => {
        toast.error("Something went wrong while sending the email!")
      }
    })
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-full group">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Button
              className={`group relative flex w-full items-center justify-center overflow-hidden 
                ${isCollapsed 
                  ? "rounded-full p-2 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                  : "rounded-full px-4 py-3 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"} 
                text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
              variant="default"
              size={isCollapsed ? "icon" : "default"}
            >
              <span className="relative z-10 flex items-center">
                <Pencil 
                  className={`${isCollapsed ? "" : "mr-2"} size-4 transition-transform duration-300 
                    group-hover:rotate-12`} 
                />
                {!isCollapsed && (
                  <span className="font-medium tracking-wide">Compose</span>
                )}
              </span>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {/* Animated sparkle effect */}
              {!isCollapsed && (
                <motion.div 
                  className="absolute -right-1 -top-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="size-3 text-yellow-300" />
                </motion.div>
              )}
            </Button>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </motion.div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] max-h-[90vh] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/95 dark:to-slate-950 border-0 rounded-t-lg backdrop-blur-sm">
        <div className="flex h-full flex-col">
          <DrawerHeader className="border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center text-xl font-medium text-slate-800 dark:text-slate-200">
                <div className="flex items-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-full p-2 mr-3">
                  <Send
                    size={16}
                    className="text-white"
                  />
                </div>
                New Message
              </DrawerTitle>
              <DrawerClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                >
                  <X size={18} className="text-slate-500 dark:text-slate-400"/>
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-auto pb-4">
            <EmailEditor
              toValues={toValues}
              setToValues={setToValues}
              ccValues={ccValues}
              setCcValues={setCcValues}
              subject={subject}
              setSubject={setSubject}
              to={toValues.map((to) => to.value)}
              defaultToolbarExpanded={true}
              handleSend={handleSend}
              isSending={sendEmail.isPending}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ComposeButton;