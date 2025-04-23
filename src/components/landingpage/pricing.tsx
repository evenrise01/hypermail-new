'use client'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false)
    
    // Animation for hover effects
    const [hoveredFree, setHoveredFree] = useState(false)
    const [hoveredPro, setHoveredPro] = useState(false)

    // Calculate pro price based on billing cycle
    const proPrice = isYearly ? 14 : 19
    const proSaving = isYearly ? "Save 25%" : ""

    return (
        <section className="py-16 md:py-32 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Choose Your Hypermail Experience
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Unlock the future of email communication with plans designed for everyone from casual users to power professionals.
                    </p>
                    
                    {/* Billing toggle */}
                    <div className="flex items-center justify-center mt-8 space-x-3">
                        <span className={`text-sm ${!isYearly ? "font-medium text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"}`}>Monthly</span>
                        <button 
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <span 
                                className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isYearly ? 'translate-x-7' : ''}`}
                            />
                        </button>
                        <span className={`text-sm ${isYearly ? "font-medium text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                            Yearly
                        </span>
                        {isYearly && (
                            <span className="ml-1 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Save 25%
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
                    {/* Free Plan */}
                    <div 
                        className={`rounded-xl flex flex-col justify-between border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 lg:p-8 transition-all duration-300 ${
                            hoveredFree ? "shadow-lg shadow-blue-500/5 transform translate-y-[-4px]" : "shadow-md shadow-zinc-200/50 dark:shadow-zinc-900/50"
                        }`}
                        onMouseEnter={() => setHoveredFree(true)}
                        onMouseLeave={() => setHoveredFree(false)}
                    >
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <h2 className="text-lg font-medium">Hypermail Basic</h2>
                                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">Free</span>
                                </div>
                                <span className="block text-3xl font-semibold">$0</span>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Forever free plan</p>
                            </div>

                            <Button asChild variant="outline" className={`w-full transition-colors duration-300 ${
                                hoveredFree ? "border-blue-400 text-blue-600 dark:border-blue-600 dark:text-blue-400" : ""
                            }`}>
                                <Link href="">Get Started</Link>
                            </Button>

                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent my-6" />

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Includes:</h3>
                                <ul className="space-y-3 text-sm">
                                    {[
                                        'Smart email categorization', 
                                        '5GB storage space', 
                                        'Basic AI assistant features',
                                        'Email templates (3)',
                                        'Mobile app access'
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                            <Check className="size-4 text-blue-500 dark:text-blue-400" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div 
                        className={`rounded-xl flex flex-col justify-between border-2 border-blue-500 dark:border-blue-600 bg-white dark:bg-zinc-900 p-6 lg:p-8 relative transition-all duration-300 ${
                            hoveredPro ? "shadow-xl shadow-blue-500/10 transform translate-y-[-4px]" : "shadow-lg shadow-blue-500/5"
                        }`}
                        onMouseEnter={() => setHoveredPro(true)}
                        onMouseLeave={() => setHoveredPro(false)}
                    >
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                            RECOMMENDED
                        </div>
                        
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <h2 className="text-lg font-medium">Hypermail Pro</h2>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-semibold">${proPrice}</span>
                                    <span className="ml-1 text-zinc-500 dark:text-zinc-400 text-sm">
                                        /{isYearly ? 'year' : 'month'}
                                    </span>
                                    {isYearly && (
                                        <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400">
                                            {proSaving}
                                        </span>
                                    )}
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Per user</p>
                            </div>

                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                                <Link href="">Upgrade Now</Link>
                            </Button>

                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent my-6" />

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Everything in Basic, plus:</h3>
                                    <ul className="space-y-3 text-sm">
                                        {[
                                            'Advanced AI email composition',
                                            'Unlimited storage space',
                                            'Auto email categorization',
                                            'Priority inbox features',
                                            'Email templates (unlimited)',
                                            'Custom email signatures',
                                            'Advanced security features',
                                            'Email scheduling',
                                            'Premium support',
                                            'Multi-account management'
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                                <Check className="size-4 text-blue-500 dark:text-blue-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Need a custom enterprise solution? <Link href="" className="text-blue-600 dark:text-blue-400 hover:underline">Contact our sales team</Link>
                </div>
            </div>
        </section>
    )
}