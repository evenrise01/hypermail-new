"use client";

import React from "react";
import EmailEditor from "./email-editor";
import { api, type RouterOutputs } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";

const ReplyBox = () => {
  const { threadId, accountId } = useThreads();
  const { data: replyDetails } = api.account.getReplyDetails.useQuery({
    threadId: threadId ?? "",
    accountId,
  });
 
  if(!replyDetails) return null

  return <Component replyDetails = {replyDetails}/>
};

const Component = ({replyDetails}: {replyDetails: RouterOutputs['account']['getReplyDetails']}) => {
  const { threadId, accountId } = useThreads();
  
  const [subject, setSubject] = React.useState(replyDetails.subject.startsWith("Re:") ? replyDetails.subject : `Re: ${replyDetails.subject}`)
  const [toValues, setToValues] = React.useState<{label: string, value: string}[]>(replyDetails.to.map(to => ({label: to.address, value: to.address})))
  const [ccValues, setCcValues] = React.useState<{label: string, value: string}[]>(replyDetails.cc.map(cc => ({label: cc.address, value: cc.address})))

  React.useEffect(() => {
    if(!threadId || !replyDetails) return

    if(!replyDetails.subject.startsWith("Re:")){
      setSubject(`Re: ${replyDetails.subject}`)
    } else {
      setSubject(replyDetails.subject)
    }
  },[threadId, accountId])

  const handleSend = async (value: string) => {
    console.log(value)
  }
  return (
    <div>
      <EmailEditor 
      subject={subject}
      setSubject={setSubject}

      toValues={toValues}
      setToValues={setToValues}

      ccValues={ccValues}
      setCcValues={setCcValues}

      to = {replyDetails.to.map(to=>to.address)}

      isSending={false}
      handleSend={handleSend}
      />
    </div>
  );
}

export default ReplyBox;
