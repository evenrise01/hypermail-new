'use client'

import { useState, useEffect, useRef } from 'react'
import { Mail, Clock, Target, Sparkles, MessageSquare, CheckCircle2, Send, PaperclipIcon, Search, Command, Settings, User, Calendar, Layout, ClipboardList, Zap, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HypermailProblemStatement from './problem-statement'
import HypermailCommandBarFeature from './command-bar-feature'

export default function HypermailLanding() {
    // We'll use refs to track DOM elements for animations
    const firstFeatureRef = useRef(null)
    const secondFeatureRef = useRef(null)
    const thirdFeatureRef = useRef(null)
    const sectionHeaderRef = useRef(null)
    
    // Track if sections are visible
    const [visibilityState, setVisibilityState] = useState({
        sectionHeader: false,
        firstFeature: false,
        secondFeature: false,
        thirdFeature: false
    })

    useEffect(() => {
        // Set up Intersection Observer to detect when elements are in viewport
        const observerOptions = {
            root: null, // use viewport
            rootMargin: '-10% 0px -10% 0px', // trigger when element is 10% in viewport
            threshold: 0.1 // trigger when 10% of element is visible
        }

        const observerCallback = (entries: any[]) => {
            entries.forEach(entry => {
                const { target, isIntersecting } = entry
                
                // Update state based on which element is intersecting
                if (target === sectionHeaderRef.current) {
                    setVisibilityState(prev => ({ ...prev, sectionHeader: isIntersecting }))
                } else if (target === firstFeatureRef.current) {
                    setVisibilityState(prev => ({ ...prev, firstFeature: isIntersecting }))
                } else if (target === secondFeatureRef.current) {
                    setVisibilityState(prev => ({ ...prev, secondFeature: isIntersecting }))
                } else if (target === thirdFeatureRef.current) {
                    setVisibilityState(prev => ({ ...prev, thirdFeature: isIntersecting }))
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)
        
        // Observe all section elements
        if (sectionHeaderRef.current) observer.observe(sectionHeaderRef.current)
        if (firstFeatureRef.current) observer.observe(firstFeatureRef.current)
        if (secondFeatureRef.current) observer.observe(secondFeatureRef.current)
        if (thirdFeatureRef.current) observer.observe(thirdFeatureRef.current)
        
        return () => {
            // Clean up observer on component unmount
            observer.disconnect()
        }
    }, [])

    // Helper function to generate animation classes
    const getAnimationClass = (isVisible: boolean, animationType: string) => {
        const baseClasses = {
            fadeIn: "transition-opacity duration-1000 ease-in-out",
            slideFromLeft: "transition-all duration-1000 ease-out transform",
            slideFromRight: "transition-all duration-1000 ease-out transform"
        }
        
        const visibleClasses = {
            fadeIn: "opacity-100",
            slideFromLeft: "opacity-100 translate-x-0",
            slideFromRight: "opacity-100 translate-x-0"
        }
        
        const hiddenClasses = {
            fadeIn: "opacity-0",
            slideFromLeft: "opacity-0 -translate-x-10",
            slideFromRight: "opacity-0 translate-x-10"
        }
        
        return `${baseClasses[animationType]} ${isVisible ? visibleClasses[animationType] : hiddenClasses[animationType]}`
    }

    return (
        <div className="bg-zinc-950 text-white overflow-hidden">
            {/* Hero Section - Email Problem */}
            <HypermailProblemStatement/>

            {/* NEW SECTION: Command Bar Palette */}
            <HypermailCommandBarFeature/>
            
            {/* NEW SECTION: Left-Right Layout with Scroll Transitions */}
            <section className="relative py-24 overflow-hidden bg-zinc-950">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
                </div>
                
                <div className="mx-auto max-w-6xl px-6 relative z-10">
                    <div 
                        ref={sectionHeaderRef}
                        className={`text-center max-w-3xl mx-auto mb-20 ${getAnimationClass(visibilityState.sectionHeader, 'fadeIn')}`}
                    >
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Designed For</span> 
                            <span className="text-white"> How You Work</span>
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            Hypermail adapts to your workflow, not the other way around.
                        </p>
                    </div>
                    
                    {/* Feature panels - these will have scroll transitions */}
                    <div className="space-y-52 py-20 my-20">
                        {/* First Feature */}
                        <div ref={firstFeatureRef} className="grid md:grid-cols-2 gap-12 items-center">
                            <div className={`space-y-6 ${getAnimationClass(visibilityState.firstFeature, 'slideFromLeft')}`}>
                                <div className="inline-block bg-blue-900/30 px-3 py-1 rounded-full text-blue-400 text-sm font-medium">
                                    Smart Sorting
                                </div>
                                <h3 className="text-2xl md:text-3xl font-semibold">
                                    <span className="text-white">Focus on what</span>
                                    <span className="text-blue-400"> matters most</span>
                                </h3>
                                <p className="text-zinc-400">
                                    AI automatically categorizes incoming emails by importance, helping you focus on high-priority messages first. No more wasting time sifting through your inbox.
                                </p>
                                <ul className="space-y-3 text-zinc-400">
                                    {[
                                        "Automatically prioritizes emails based on content and sender",
                                        "Categorizes into Priority, Important, and Can Wait",
                                        "Learns from your interactions to improve over time"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className={`relative ${getAnimationClass(visibilityState.firstFeature, 'slideFromRight')}`}>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20"></div>
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                                    <div className="h-10 bg-zinc-800/70 flex items-center px-4">
                                        <div className="text-sm text-zinc-300">Priority Inbox</div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between p-2 px-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <div className="text-sm font-medium text-white">Priority (3)</div>
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                                            </div>
                                        
                                        {/* Priority emails */}
                                        <div className="pl-5 space-y-2">
                                            {[
                                                { sender: "Alex Morgan", subject: "Urgent: Client Meeting Today", time: "10 min ago", color: "blue" },
                                                { sender: "Sarah Li", subject: "RE: Project Deadline Extension", time: "25 min ago", color: "blue" },
                                                { sender: "Finance Team", subject: "Budget Approval Required", time: "1 hour ago", color: "blue" }
                                            ].map((email, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-between transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer"
                                                    style={{ 
                                                        transitionDelay: `${idx * 150}ms`,
                                                        opacity: visibilityState.firstFeature ? 1 : 0,
                                                        transform: visibilityState.firstFeature 
                                                            ? 'translateY(0)' 
                                                            : 'translateY(10px)'
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-blue-500`}></div>
                                                        <div className="text-sm font-medium text-white">{email.sender}</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-xs text-zinc-400 max-w-xs truncate">{email.subject}</div>
                                                        <div className="text-xs text-zinc-500">{email.time}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Important section */}
                                        <div className="flex items-center justify-between p-2 px-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                <div className="text-sm font-medium text-white">Important (5)</div>
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        
                                        {/* Can Wait section */}
                                        <div className="flex items-center justify-between p-2 px-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                <div className="text-sm font-medium text-white">Can Wait (12)</div>
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        
                                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-xl -z-10"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Second Feature */}
                        <div ref={secondFeatureRef} className="grid md:grid-cols-2 gap-12 items-center">
                            <div className={`relative order-2 md:order-1 ${getAnimationClass(visibilityState.secondFeature, 'slideFromLeft')}`}>
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20"></div>
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                                    <div className="h-10 bg-zinc-800/70 flex items-center px-4">
                                        <div className="text-sm text-zinc-300">AI Compose</div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">New Message</div>
                                                    <div className="text-xs text-zinc-500">To: marketing@acme.com</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 mb-4"
                                            style={{ 
                                                transition: 'all 800ms ease',
                                                transitionDelay: '200ms',
                                                opacity: visibilityState.secondFeature ? 1 : 0,
                                                transform: visibilityState.secondFeature 
                                                    ? 'translateY(0) scale(1)' 
                                                    : 'translateY(20px) scale(0.98)'
                                            }}
                                        >
                                            <div className="text-sm text-zinc-400 mb-2">Subject: Marketing Campaign Results - Q1 2025</div>
                                            <div className="space-y-2 text-sm text-zinc-300">
                                                <p>Hi Team,</p>
                                                <p>I've analyzed the Q1 campaign performance data and have some exciting results to share with you.</p>
                                                <p>The new approach we implemented in March has shown a 25% increase in conversion rates compared to our previous strategy.</p>
                                                <p>I'd like to schedule a short meeting later this week to discuss these findings in more detail.</p>
                                                <p>Best regards,</p>
                                                <p>Your Name</p>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                                            style={{ 
                                                transition: 'all 800ms ease',
                                                transitionDelay: '400ms',
                                                opacity: visibilityState.secondFeature ? 1 : 0,
                                                transform: visibilityState.secondFeature 
                                                    ? 'translateY(0)' 
                                                    : 'translateY(20px)'
                                            }}
                                        >
                                            <div className="bg-purple-500/20 p-2 rounded-full">
                                                <Sparkles className="h-4 w-4 text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-white mb-1">AI Suggestions</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        "Add specific metrics",
                                                        "Suggest meeting times",
                                                        "More friendly tone"
                                                    ].map((suggestion, idx) => (
                                                        <button 
                                                            key={idx} 
                                                            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full transition-colors"
                                                            style={{ 
                                                                transitionDelay: `${500 + idx * 150}ms`,
                                                                opacity: visibilityState.secondFeature ? 1 : 0,
                                                                transform: visibilityState.secondFeature 
                                                                    ? 'translateY(0)' 
                                                                    : 'translateY(10px)'
                                                            }}
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl -z-10"></div>
                            </div>
                            
                            <div className={`space-y-6 order-1 md:order-2 ${getAnimationClass(visibilityState.secondFeature, 'slideFromRight')}`}>
                                <div className="inline-block bg-purple-900/30 px-3 py-1 rounded-full text-purple-400 text-sm font-medium">
                                    AI Writer
                                </div>
                                <h3 className="text-2xl md:text-3xl font-semibold">
                                    <span className="text-white">Craft perfect emails</span>
                                    <span className="text-purple-400"> in seconds</span>
                                </h3>
                                <p className="text-zinc-400">
                                    Stop staring at blank screens or writing the same responses over and over. 
                                    Let Hypermail's AI help you write better emails, faster.
                                </p>
                                <ul className="space-y-3 text-zinc-400">
                                    {[
                                        "Generate complete emails based on simple prompts",
                                        "Perfect tone and style to match your recipient",
                                        "Real-time suggestions as you write"
                                    ].map((item, idx) => (
                                        <li 
                                            key={idx} 
                                            className="flex items-center gap-2"
                                            style={{ 
                                                transition: 'all 500ms ease',
                                                transitionDelay: `${idx * 150}ms`,
                                                opacity: visibilityState.secondFeature ? 1 : 0,
                                                transform: visibilityState.secondFeature 
                                                    ? 'translateX(0)' 
                                                    : 'translateX(20px)'
                                            }}
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        {/* Third Feature */}
                        <div ref={thirdFeatureRef} className="grid md:grid-cols-2 gap-12 items-center">
                            <div className={`space-y-6 ${getAnimationClass(visibilityState.thirdFeature, 'slideFromLeft')}`}>
                                <div className="inline-block bg-green-900/30 px-3 py-1 rounded-full text-green-400 text-sm font-medium">
                                    Smart Follow-Up
                                </div>
                                <h3 className="text-2xl md:text-3xl font-semibold">
                                    <span className="text-white">Never let important</span>
                                    <span className="text-green-400"> emails slip through</span>
                                </h3>
                                <p className="text-zinc-400">
                                    Stop losing deals and opportunities because of missed follow-ups. 
                                    Hypermail tracks your important conversations and reminds you when it's time to follow up.
                                </p>
                                <ul className="space-y-3 text-zinc-400">
                                    {[
                                        "Automatic detection of emails needing follow-up",
                                        "Custom follow-up schedules for different contacts",
                                        "One-click follow-up email suggestions"
                                    ].map((item, idx) => (
                                        <li 
                                            key={idx} 
                                            className="flex items-center gap-2"
                                            style={{ 
                                                transition: 'all 500ms ease',
                                                transitionDelay: `${idx * 150}ms`,
                                                opacity: visibilityState.thirdFeature ? 1 : 0,
                                                transform: visibilityState.thirdFeature 
                                                    ? 'translateX(0)' 
                                                    : 'translateX(-20px)'
                                            }}
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className={`relative ${getAnimationClass(visibilityState.thirdFeature, 'slideFromRight')}`}>
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-cyan-600 rounded-2xl blur opacity-20"></div>
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                                    <div className="h-10 bg-zinc-800/70 flex items-center px-4">
                                        <div className="text-sm text-zinc-300">Follow-Up Dashboard</div>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-white">Pending Follow-Ups</div>
                                            <div className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">This Week</div>
                                        </div>
                                        
                                        {/* Follow-up items */}
                                        {[
                                            { 
                                                contact: "Venture Capital Partners", 
                                                subject: "Investment Proposal Discussion", 
                                                status: "Waiting 3 days", 
                                                priority: "high" 
                                            },
                                            { 
                                                contact: "Tech Innovations Inc", 
                                                subject: "Product Partnership Opportunity", 
                                                status: "Waiting 5 days", 
                                                priority: "medium" 
                                            },
                                            { 
                                                contact: "Marketing Team", 
                                                subject: "Campaign Launch Timeline", 
                                                status: "Waiting 2 days", 
                                                priority: "low" 
                                            }
                                        ].map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer"
                                                style={{ 
                                                    transition: 'all 500ms ease',
                                                    transitionDelay: `${idx * 200}ms`,
                                                    opacity: visibilityState.thirdFeature ? 1 : 0,
                                                    transform: visibilityState.thirdFeature 
                                                        ? 'translateY(0) scale(1)' 
                                                        : 'translateY(15px) scale(0.98)'
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-sm font-medium text-white">{item.contact}</div>
                                                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                                                        item.priority === "high" 
                                                            ? "bg-red-900/40 text-red-400" 
                                                            : item.priority === "medium"
                                                                ? "bg-yellow-900/40 text-yellow-400"
                                                                : "bg-green-900/40 text-green-400"
                                                    }`}>
                                                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-zinc-400 mb-2">{item.subject}</div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-zinc-500">{item.status}</div>
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30 text-xs px-2 py-0"
                                                    >
                                                        Follow Up Now
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <div 
                                            className="text-xs text-zinc-500 text-center pt-2"
                                            style={{ 
                                                transition: 'all 500ms ease',
                                                transitionDelay: '700ms',
                                                opacity: visibilityState.thirdFeature ? 1 : 0
                                            }}
                                        >
                                            View all follow-ups (12)
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-500/20 rounded-full blur-xl -z-10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}