import { api } from "@/trpc/react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { atom, useAtom } from 'jotai';

export const threadIdAtom = atom<string|null>(null);

const useThreads = () => {
  const { data: accounts } = api.account.getAccounts.useQuery();
  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage("hypermail-tab", "inbox");
  const [done] = useLocalStorage("hypermail-done", false);
  const [threadId, setThreadId] = useAtom(threadIdAtom);

  const { 
    data: threads, 
    isFetching, 
    isLoading,
    refetch 
  } = api.account.getThreads.useQuery(
    {
      accountId,
      tab,
      done,
    },
    {
      enabled: !!accountId && !!tab,
      placeholderData: (e) => e,
      refetchInterval: 5 * 60 * 1000, //5 minute refetch interval
    },
  );

  // Mark as loading when either initially loading or refetching
  const isLoadingThreads = isLoading || isFetching;

  // console.log("Threads from use-threads: ", threads)
  return {
    threads,
    isFetching,
    isLoading: isLoadingThreads,
    refetch,
    accountId,
    account: accounts?.find(e => e.id === accountId),
    threadId,
    setThreadId
  };
};

export default useThreads;