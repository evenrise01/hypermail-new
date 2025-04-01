"use client";

import React from "react";
import EmailEditor from "./email-editor";
import { api, type RouterOutputs } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";
import { Skeleton } from "@/components/ui/skeleton";

const ReplyBox = () => {
  const { threadId, accountId } = useThreads();
  const { data: replyDetails, isLoading } = api.account.getReplyDetails.useQuery({
    threadId: threadId ?? "",
    accountId,
  }, {
    enabled: !!threadId && !!accountId,
  });
 
  // Show skeleton loading state instead of null
  if(isLoading || !replyDetails) {
    return <ReplyBoxSkeleton />;
  }

  return <Component replyDetails={replyDetails} />;
};

// Skeleton component for loading state
const ReplyBoxSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="flex items-center space-x-2 mb-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-44" />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-40 w-full" />
      <div className="flex justify-end">
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
};

const Component = ({replyDetails}: {replyDetails: RouterOutputs['account']['getReplyDetails']}) => {
  const { threadId, accountId } = useThreads();
  
  const [subject, setSubject] = React.useState(replyDetails.subject.startsWith("Re:") ? replyDetails.subject : `Re: ${replyDetails.subject}`);
  const [toValues, setToValues] = React.useState<{label: string, value: string}[]>(replyDetails.to.map(to => ({label: to.address, value: to.address})));
  const [ccValues, setCcValues] = React.useState<{label: string, value: string}[]>(replyDetails.cc.map(cc => ({label: cc.address, value: cc.address})));

  React.useEffect(() => {
    if(!threadId || !replyDetails) return;

    if(!replyDetails.subject.startsWith("Re:")){
      setSubject(`Re: ${replyDetails.subject}`);
    } else {
      setSubject(replyDetails.subject);
    }
    
    // Update to and cc values when reply details change
    setToValues(replyDetails.to.map(to => ({label: to.address, value: to.address})));
    setCcValues(replyDetails.cc.map(cc => ({label: cc.address, value: cc.address})));
  }, [threadId, accountId, replyDetails]);

  const handleSend = async (value: string) => {
    console.log(value);
  };
  
  return (
    <div>
      <EmailEditor 
        subject={subject}
        setSubject={setSubject}
        toValues={toValues}
        setToValues={setToValues}
        ccValues={ccValues}
        setCcValues={setCcValues}
        to={replyDetails.to.map(to=>to.address)}
        isSending={false}
        handleSend={handleSend}
      />
    </div>
  );
};

export default ReplyBox;