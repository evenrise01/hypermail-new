import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Pencil, Send, X } from "lucide-react";
import React from "react";
import EmailEditor from "./email-editor";
import { api } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";
import { toast } from "sonner";

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
  const {account } = useThreads()

  const handleSend = async (value: string) => {
    if(!account) return

    sendEmail.mutate({
      accountId: account.id,
      threadId: undefined, //Undefined because it's a new email thread
      body: value,
      from: {name: account?.name ?? "Me", address: account.emailAddress ?? "me@example.com"},
      to: toValues.map(to => ({name: to.value, address: to.value})),
      cc: ccValues.map(cc => ({name: cc.value, address: cc.value})),
      replyTo: {name: account?.name ?? "Me", address: account.emailAddress ?? "me@example.com"},
      subject: subject,
      inReplyTo: undefined //undefined since we are starting a new email thread
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
          <Button
            className={`group relative flex w-full items-center justify-center overflow-hidden 
              ${isCollapsed 
                ? "rounded-full p-2 bg-blue-600 hover:bg-blue-700" 
                : "rounded-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"} 
              text-white shadow-md transition-all duration-300 hover:shadow-lg`}
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
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] max-h-[90vh] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-t-0 rounded-t-lg">
        <div className="flex h-full flex-col">
          <DrawerHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center text-xl font-light text-slate-800 dark:text-slate-200">
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                  <Send
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                Compose New Email
              </DrawerTitle>
              <DrawerClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} className="text-slate-500"/>
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