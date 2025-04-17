// hooks/useThreadActions.ts
import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useThreadActions = () => {
  const utils = api.useUtils();

  const archiveThread = api.thread.archiveThread.useMutation({
    onSuccess: () => {
      utils.thread.invalidate();
      toast.success("Thread archived");
    },
    onError: () => toast.error("Failed to archive thread"),
  });

  const trashThread = api.thread.trashThread.useMutation({
    onSuccess: () => {
      utils.thread.invalidate();
      toast.success("Thread moved to trash");
    },
    onError: () => toast.error("Failed to move thread to trash"),
  });

  const starThread = api.thread.starThread.useMutation({
    onSuccess: () => {
      utils.thread.invalidate();
      toast.success("Thread starred!");
    },
    onError: () => toast.error("Failed to star the thread!"),
  });

  const spamThread = api.thread.spamThread.useMutation({
    onSuccess: () => {
      utils.thread.invalidate();
      toast.success("Thread moved to spam!");
    },
    onError: () => toast.error("Failed to move the thread to spam!"),
  });

  const markAsReadThread = api.thread.spamThread.useMutation({
    onSuccess: () => {
      utils.thread.invalidate();
      toast.success("Thread marked as read successfully");
    },
    onError: () => toast.error("Failed to mark the thread as read"),
  });

  const markAsUnreadThread = api.thread.spamThread.useMutation({
    onSuccess: () => {
      utils.thread.invalidate();
      toast.success("Thread marked as unread succesfully");
    },
    onError: () => toast.error("Failed to mark the thread as unread"),
  });

  return {
    archiveThread: (threadId: string, accountId: string) =>
      archiveThread.mutate({ threadId, accountId }),
    trashThread: (threadId: string, accountId: string) =>
      trashThread.mutate({ threadId, accountId }),
    starThread: (threadId: string, accountId: string) =>
      starThread.mutate({ threadId, accountId }),
    spamThread: (threadId: string, accountId: string) =>
      spamThread.mutate({ threadId, accountId }),
    markAsReadThread: (threadId: string, accountId: string) =>
      markAsReadThread.mutate({ threadId, accountId }),
    markAsUnreadThread: (threadId: string, accountId: string) =>
      markAsUnreadThread.mutate({ threadId, accountId }),
  };
};
