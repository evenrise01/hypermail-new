'use client'
import { Button } from '@/components/ui/button'
import { createBillingPortalSession, createCheckoutSession, getSubscriptionStatus } from '@/lib/stripe-actions'
import React from 'react'
import { CreditCard, Settings, Zap } from 'lucide-react'

type StripeButtonProps = {
  isCollapsed?: boolean;
}

const StripeButton = ({ isCollapsed = false }: StripeButtonProps) => {
    const [isSubscribed, setIsSubscribed] = React.useState(false)
    React.useEffect(() => {
        (async () => {
            const isSubscribed = await getSubscriptionStatus()
            setIsSubscribed(isSubscribed)
        })()
    }, [])

    const handleClick = async () => {
        if (!isSubscribed) {
            await createCheckoutSession()
        } else {
            await createBillingPortalSession()
        }
    }
    
    return (
      <Button 
        variant="outline" 
        size={isCollapsed ? "icon" : "default"} 
        onClick={handleClick}
        className={`
          relative group bg-slate-100 border-slate-200 hover:bg-slate-200 hover:border-slate-300 
          dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-slate-600
          transition-all duration-300 ${isCollapsed ? 'w-8 h-8 p-1' : 'w-full'}
        `}
      >
        {isSubscribed ? (
          <>
            <Settings size={isCollapsed ? 16 : 16} className={`${isCollapsed ? "" : "mr-2"} text-slate-600 dark:text-slate-300`} />
            {!isCollapsed && <span>Manage</span>}
          </>
        ) : (
          <>
            <Zap size={isCollapsed ? 16 : 16} className={`${isCollapsed ? "" : "mr-2"} text-amber-500`} />
            {!isCollapsed && <span>Upgrade</span>}
          </>
        )}
      </Button>
    )
}

export default StripeButton