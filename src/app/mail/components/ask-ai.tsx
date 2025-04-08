'use client'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion';
import React, { useRef, useState } from 'react'
import { Send, Sparkles, Loader2, Zap, Brain } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PremiumBanner from './premium-banner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

type Props = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

  
const AskAI = ({ isCollapsed, toggleCollapse }: Props) => {
  const [accountId] = useLocalStorage('accountId', '')
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  
  const { input, handleInputChange, handleSubmit, messages, isLoading } = useChat({
    api: "/api/chat",
    body: {
      accountId,
    },
    onError: (error) => {
      console.error('Chat error:', error); // Add this
      if (error.message.includes('Limit reached')) {
        toast.error('You have reached the limit for today. Please upgrade to pro to ask as many questions as you want.')
      }
    },
    onFinish: (message) => {
      console.log('Finished streaming message:', message); // Add this
    },
    initialMessages: [],
  });

  React.useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isCollapsed) {
    return (
      <div className="my-6 flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={toggleCollapse}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                "bg-gradient-to-br from-indigo-500 to-purple-500 text-white",
                "hover:shadow-md hover:shadow-indigo-500/30",
                "transition-all duration-200"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="size-5" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Talk to AI Assistant
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
  
  const quickPrompts = [
    { text: 'What can I ask?', icon: <Brain className="size-3" /> },
    { text: 'When is my next flight?', icon: <Zap className="size-3" /> },
    { text: 'When is my next meeting?', icon: <Sparkles className="size-3" /> },
  ];

  return (
    <div className='py-4 mb-6'>
      
      <motion.div 
        className={cn(
          "flex flex-1 flex-col items-end justify-end p-3 rounded-xl shadow-sm",
          "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20",
          "backdrop-blur-sm border border-white/30 dark:border-white/5",
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
              <Brain className="size-3 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-800 dark:text-gray-200">Hypermail AI</h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Email assistant</p>
            </div>
          </div>
          {isLoading && (
            <div className="flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400">
              <Loader2 className="size-2 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
        </div>
        
        <div 
          ref={messageContainerRef}
          className="max-h-[30vh] overflow-y-auto w-full flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent dark:scrollbar-thumb-indigo-800" 
          id="message-container"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                layout
                className={cn(
                  "z-10 max-w-[80%] break-words rounded-lg px-3 py-1.5 text-xs",
                  message.role === 'user' ? 
                    "self-end bg-indigo-500 text-white" : 
                    "self-start bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 shadow-sm"
                )}
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              className="self-start bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg shadow-sm max-w-[80%]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></span>
              </div>
            </motion.div>
          )}
        </div>
        
        {messages.length > 0 && <div className="h-2"></div>}
        
        <div className="w-full mt-2">
          {messages.length === 0 && (
            <motion.div 
              className="mb-3 mt-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                  <Sparkles className="size-3 text-white" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-xs">Quick prompts</p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {quickPrompts.map((prompt, index) => (
                  <motion.div
                    key={prompt.text}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 + (index * 0.1) }}
                    onClick={() => {
                      handleInputChange({ target: { value: prompt.text } } as any);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-gray-800/50 shadow-sm border border-indigo-100/50 dark:border-indigo-800/30 hover:bg-white hover:shadow-md dark:hover:bg-gray-800/80 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-200">
                      {prompt.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">{prompt.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          <form 
            onSubmit={handleSubmit} 
            className="flex w-full relative"
          >
            <div className={cn(
              "flex items-center flex-grow overflow-hidden rounded-full border transition-all duration-200 ease-in-out",
              "bg-white/70 backdrop-blur-sm dark:bg-gray-800/50",
              focused ? 
                "border-indigo-500 shadow-md dark:border-indigo-500/70 ring-2 ring-indigo-500/20 dark:ring-indigo-500/10" : 
                "border-gray-200 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-700/50"
            )}>
              <input
                ref={inputRef}
                type="text"
                onChange={handleInputChange}
                value={input}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={cn(
                  "h-8 flex-grow px-3 text-xs bg-transparent outline-none",
                  "text-gray-800 placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500"
                )}
                placeholder="Ask about your emails..."
              />
              
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                  "flex h-6 w-6 mr-1 items-center justify-center rounded-full",
                  "bg-gradient-to-br from-indigo-500 to-purple-500 text-white",
                  "hover:shadow-md hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                  "transition-all duration-200"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Send className="size-3" />
                )}
              </motion.button>
            </div>
          </form>
          
          {/* Subtle branding */}
          <div className="mt-2 flex justify-center">
            <span className="text-[10px] text-gray-400 dark:text-gray-600">Hypermail AI</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AskAI