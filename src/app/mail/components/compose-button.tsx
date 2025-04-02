import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Pencil, Send } from "lucide-react";
import { motion } from "framer-motion";
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
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full"
        >
          <Button
            className={`flex w-full items-center justify-center border-none bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] px-2 py-2 font-medium text-white shadow-md transition-all duration-300 hover:from-[#1D2B64] hover:to-[#F8CDDA] hover:shadow-lg ${isCollapsed ? "px-2" : "px-4"}`}
            variant="default"
            size={isCollapsed ? "icon" : "default"}
          >
            <Pencil className={`${isCollapsed ? "mr-0" : "mr-2"} size-4`} />
            {!isCollapsed && (
              <span className="whitespace-nowrap">Compose</span>
            )}
          </Button>
        </motion.div>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] max-h-[90vh] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="flex h-full flex-col">
          <DrawerHeader>
            <DrawerTitle className="flex items-center text-xl">
              <Send
                size={18}
                className="mr-2 text-[#1D2B64] dark:text-[#F8CDDA]"
              />
              Compose New Email
            </DrawerTitle>
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