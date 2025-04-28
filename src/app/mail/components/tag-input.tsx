import useThreads from "@/hooks/use-threads";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import Avatar from "react-avatar";
import Select from "react-select";
import { cn } from "@/lib/utils";

type Props = {
  placeholder: string;
  label?: string;
  onChange: (values: { label: string; value: string }[]) => void;
  value: { label: string; value: string }[];
  className?: string;
};

const TagInput = ({
  placeholder,
  label,
  onChange,
  value,
  className,
}: Props) => {
  const { accountId } = useThreads();
  const { data: suggestions } = api.account.getSuggestions.useQuery({
    accountId,
  });
  const [input, setInput] = useState('');

  const options = suggestions?.map((suggestion) => ({
    label: (
      <span className="flex items-center gap-2">
        <Avatar
          name={suggestion.address}
          size="25"
          textSizeRatio={2}
          round={true}
          color="#1D2B64"
          fgColor="#FFFFFF"
        />
        {suggestion.address}
      </span>
    ),
    value: suggestion.address,
  }));

  return (
    <div className={cn(
      "flex items-center rounded-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-sm focus-within:shadow-md focus-within:border-[#F8CDDA]/50 dark:focus-within:border-[#F8CDDA]/30", 
      className
    )}>
      {label && <span className="ml-3 text-sm text-[#1D2B64] dark:text-white font-medium">{label}</span>}
      <Select
        className="w-full flex-1"
        value={value}
        //@ts-expect-error assignment error expected
        onChange={onChange}
        placeholder={placeholder}
        isMulti
        onInputChange={(newInput) => setInput(newInput)}
        //@ts-expect-error options to be type ignored
        options={input ? options?.concat({
            label: (
                <span className='flex items-center gap-2'>
                    <Avatar 
                      name={input} 
                      size='25' 
                      textSizeRatio={2} 
                      round={true} 
                      color="#1D2B64"
                      fgColor="#FFFFFF"
                    />
                    {input}
                </span>
            ), 
            value: input
        }) : options}
        classNames={{
            control: () => {
                return '!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent py-1 px-1'
            },
            multiValue: () => {
                return 'bg-gradient-to-r from-[#1D2B64]/10 to-[#F8CDDA]/10 dark:from-[#1D2B64]/80 dark:to-[#F8CDDA]/80 rounded-md transition-all duration-200'
            },
            multiValueLabel: () => {
                return 'text-[#1D2B64] dark:text-white rounded-md font-medium py-1'
            },
            multiValueRemove: () => {
                return 'hover:bg-[#F8CDDA]/20 hover:text-[#1D2B64] dark:hover:bg-[#F8CDDA]/40 dark:hover:text-white transition-all duration-200 rounded-md'
            },
            menu: () => {
                return 'border border-gray-200 bg-white/95 dark:border-gray-700 dark:bg-gray-800/95 shadow-lg rounded-md mt-1 backdrop-blur-sm'
            },
            option: (state) => {
                return cn(
                  'transition-all duration-200',
                  state.isFocused ? 'bg-gradient-to-r from-[#1D2B64]/10 to-[#F8CDDA]/10 dark:from-[#1D2B64]/50 dark:to-[#F8CDDA]/50 dark:text-white' : '',
                  state.isSelected ? 'bg-gradient-to-r from-[#1D2B64]/20 to-[#F8CDDA]/20 dark:from-[#1D2B64]/60 dark:to-[#F8CDDA]/60 dark:text-white' : ''
                )
            },
            input: () => {
                return 'text-gray-700 dark:text-white'
            },
            placeholder: () => {
                return 'text-gray-400 dark:text-gray-300'
            }
        }}
        classNamePrefix="select"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#F8CDDA',
            primary25: 'rgba(248, 205, 218, 0.25)',
            primary50: 'rgba(248, 205, 218, 0.5)',
            primary75: 'rgba(248, 205, 218, 0.75)',
            neutral0: 'var(--background)', // This adapts to light/dark mode
            neutral5: 'var(--border)',
            neutral10: 'var(--input)',
            neutral20: 'var(--border)',
            neutral30: 'var(--border-hover)',
            neutral40: 'var(--input-foreground)',
            neutral50: 'var(--input-placeholder)',
            neutral60: 'var(--input-foreground)',
            neutral70: 'var(--input-foreground)',
            neutral80: 'var(--foreground)',
            neutral90: 'var(--foreground)',
          },
        })}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'transparent',
          }),
          multiValue: (base) => ({
            ...base,
            // Add a subtle text shadow to improve readability on gradient backgrounds in dark mode
            textShadow: 'var(--tw-mode) === "dark" ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "none"',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: 'var(--tw-mode) === "dark" ? "white" : "#1D2B64"',
            fontWeight: 500,
          }),
          menuList: (base) => ({
            ...base,
            padding: 8,
          }),
        }}
      />
    </div>
  );
};

export default TagInput;