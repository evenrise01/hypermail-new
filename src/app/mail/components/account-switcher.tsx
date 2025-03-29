"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react"; //Make sure api is imported from react and not server
import { Plus } from "lucide-react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  isCollapsed: boolean;
};

const AccountSwitcher = ({ isCollapsed }: Props) => {
  const { data} = api.account.getAccounts.useQuery();

//   console.log("Fetched accounts:", data);
//   console.log("Error:", error);
//   console.log("Loading:", isLoading);

  //useState is temporal - if the user refreshes the page, the state would be gone.
  //Instead save to the local storage by using useLocalStorage hook from usehooks-ts
  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  if (!data) return null;
  return (
    <Select defaultValue={accountId} onValueChange={setAccountId}>
      <SelectTrigger
        className={cn(
          "flex w-full flex-1 items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span className={cn({ hidden: !isCollapsed })}>
            {
              data.find((account: { id: string }) => account.id === accountId)
                ?.emailAddress[0]
            }
          </span>
          <span className={cn({ hidden: isCollapsed, "ml-2": true })}>
            {
              data.find((account: { id: string }) => account.id === accountId)
                ?.emailAddress
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data.map((account) => {
          console.log("account", account.emailAddress);
          return (
            <SelectItem key={account.id} value={account.id}>
              {account.emailAddress}
            </SelectItem>
          );
        })}
        <div
          onClick={async () => {
            const authUrl = await getAurinkoAuthUrl("Office365");
            window.location.href = authUrl;
          }}
          className="focus:bg-accent relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none hover:bg-gray-50"
        >
          <Plus className="mr-1 size-4" /> Add Account
        </div>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
