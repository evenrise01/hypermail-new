'use client'
import React from 'react'
import { motion } from 'framer-motion'
import StripeButton from './stripe-button'
import { api } from '@/trpc/react'
import { FREE_CREDITS_PER_DAY } from '@/app/constants'
import { getSubscriptionStatus } from '@/lib/stripe-actions'
import { Sparkles, Zap } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavProps {
  isCollapsed: boolean
}

const PremiumBanner = ({ isCollapsed }: NavProps) => {
    // const [isSubscribed, setIsSubscribed] = React.useState(false)
    // React.useEffect(() => {
    //     (async () => {
    //         const subscriptionStatus = await getSubscriptionStatus()
    //         setIsSubscribed(subscriptionStatus)
    //     })()
    // }, [])

    // const { data: chatbotInteraction } = api.account.getChatbotInteraction.useQuery()
    // const remainingCredits = chatbotInteraction?.remainingCredits || 0
    const remainingCredits = FREE_CREDITS_PER_DAY; // Using the constant for now, would be replaced with actual data

    const botImage = "/bot.webp";

    // Premium plan (currently disabled with the false condition)
    if (false) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.div 
                            layout 
                            initial={{ opacity: 0.9, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`bg-gradient-to-r from-blue-900 to-indigo-900 relative ${isCollapsed ? 'p-2' : 'p-6'} rounded-xl border border-blue-700/30 overflow-hidden shadow-lg cursor-pointer`}
                        >
                            {/* Show minimal content when collapsed */}
                            {isCollapsed ? (
                                <div className="flex flex-col items-center justify-center">
                                    <StripeButton isCollapsed={isCollapsed} />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6 items-center relative z-10">
                                    <div className="md:flex-1">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Sparkles size={18} className="text-blue-400" />
                                            <h1 className="text-white text-xl font-medium">Premium Plan</h1>
                                        </div>
                                        <div className="h-3"></div>
                                        <p className="text-blue-200 text-sm md:w-full text-center">
                                            Unlimited access to Hypermail's AI features. Ask as many questions as you want.
                                        </p>
                                        <div className="h-5"></div>
                                        <StripeButton isCollapsed={isCollapsed} />
                                    </div>
                                </div>
                            )}
                            
                            {/* Abstract shapes/lights */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mb-20"></div>
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Premium Plan - Unlimited access</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    // Basic plan (default current state)
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div 
                        layout 
                        initial={{ opacity: 0.9, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 relative ${isCollapsed ? 'p-2 mt-4' : 'p-6'} rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-lg ${isCollapsed ? 'cursor-pointer' : ''}`}
                    >
                        {/* Show minimal content when collapsed */}
                        {isCollapsed ? (
                            <div className="flex flex-col items-center justify-center">
                                <StripeButton isCollapsed={isCollapsed} />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 items-center relative z-10">
                                <div className="md:flex-1">
                                    <div className="flex items-center flex-col gap-2">
                                        <h1 className="text-slate-800 dark:text-white text-xl font-medium">Basic Plan</h1>
                                        <div className="px-3 py-1 bg-slate-200/70 dark:bg-slate-700/50 backdrop-blur-sm rounded-full flex items-center gap-1">
                                            <Zap size={12} className="text-blue-500 dark:text-blue-400" />
                                            <p className="text-slate-700 dark:text-slate-300 text-xs font-medium">{remainingCredits} messages left</p>
                                        </div>
                                    </div>
                                    <div className="h-3"></div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm md:w-full text-center">
                                        Upgrade to Premium for unlimited access to all of Hypermail's AI features.
                                    </p>
                                    <div className="h-5"></div>
                                    <StripeButton isCollapsed={isCollapsed} />
                                </div>
                            </div>
                        )}
                        
                        {/* Abstract shapes/lights */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -mb-20"></div>
                    </motion.div>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right">
                        <div className="flex items-center gap-1">
                            <Zap size={12} className="text-blue-500 dark:text-blue-400" />
                            <p className="text-slate-800 dark:text-slate-200">{remainingCredits} messages left today</p>
                        </div>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    )
}

export default PremiumBanner