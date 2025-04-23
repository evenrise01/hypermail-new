'use client'

import { useState, useEffect } from 'react'
import { Mail, Clock, Target, Sparkles, MessageSquare, CheckCircle2, Send, PaperclipIcon, Search, Command, Settings, User, Calendar, Layout, ClipboardList, Zap, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HypermailLanding() {
    const [scrollY, setScrollY] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [commandBarOpen, setCommandBarOpen] = useState(false)
    
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    const parallaxOffset = scrollY * 0.05
    
    const toggleCommandBar = () => {
        setCommandBarOpen(!commandBarOpen)
    }

    return (
        <div className="bg-zinc-950 text-white overflow-hidden">
            {/* Hero Section - Email Problem */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-16 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                <div className="mx-auto max-w-6xl px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
                        <div className="space-y-8 opacity-0 animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                                <span className="text-white">Email is the </span>
                                <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">biggest problem</span>
                                <br />
                                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">hiding in plain sight</span>
                            </h1>
                            
                            <p className="text-zinc-400 text-lg md:text-xl max-w-lg">
                                We all spend hours on email. But we often reply late, and sometimes don't even reply.
                                We then end up losing deals, blocking our teams, and missing our goals.
                            </p>
                            
                            <p className="text-zinc-400 text-lg md:text-xl max-w-lg">
                                It's not anybody's fault. Email itself has not changed in decades.
                                <span className="text-white font-medium"> With Hypermail, this all changes.</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button 
                                    size="lg" 
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none relative overflow-hidden group transition-all duration-300"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    <span className="relative z-10">Get Started Free</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                                </Button>
                                <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all duration-300">
                                    See How It Works
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-800 mt-10">
                                <div className="space-y-2 transition-all duration-300 hover:translate-y-[-4px]">
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-4 text-blue-400" />
                                        <h3 className="text-sm font-medium text-white">Smart Inbox</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm">AI-powered email categorization and prioritization</p>
                                </div>
                                <div className="space-y-2 transition-all duration-300 hover:translate-y-[-4px]">
                                    <div className="flex items-center gap-2">
                                        <Clock className="size-4 text-indigo-400" />
                                        <h3 className="text-sm font-medium text-white">Save Time</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm">Cut your email time by 50% with AI assistance</p>
                                </div>
                                <div className="space-y-2 col-span-2 sm:col-span-1 transition-all duration-300 hover:translate-y-[-4px]">
                                    <div className="flex items-center gap-2">
                                        <Target className="size-4 text-purple-400" />
                                        <h3 className="text-sm font-medium text-white">Never Miss</h3>
                                    </div>
                                    <p className="text-zinc-400 text-sm">Automated follow-ups and response tracking</p>
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            className="relative opacity-0 animate-fadeIn" 
                            style={{
                                transform: `translateY(${-parallaxOffset}px)`,
                                animationDelay: '0.6s',
                                animationFillMode: 'forwards'
                            }}
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                            <div className="relative z-10 rounded-2xl border border-zinc-700/50 bg-zinc-900/90 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10 hover:border-zinc-600/60">
                                <div className="h-10 bg-zinc-800/70 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                                        <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                                        <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                                    </div>
                                    <div className="text-xs text-zinc-400 flex-1 text-center">Hypermail - Smart Inbox</div>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-all duration-300 hover:bg-blue-500/15">
                                            <div className="bg-blue-500/20 p-2 rounded-full animate-pulse">
                                                <Sparkles className="h-4 w-4 text-blue-400" />
                                            </div>
                                            <div className="text-sm text-zinc-300">
                                                <span className="text-white font-medium">AI Assistant</span>: I've drafted 3 responses for your priority emails
                                            </div>
                                        </div>
                                        
                                        {[1, 2, 3].map((item) => (
                                            <div 
                                                key={item} 
                                                className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex justify-between items-center transition-all duration-300 hover:bg-zinc-800/70 hover:border-zinc-700"
                                                style={{ animationDelay: `${item * 0.2}s` }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                                                    <div>
                                                        <div className="h-3 w-24 bg-zinc-700 rounded"></div>
                                                        <div className="h-2 w-32 bg-zinc-700/70 rounded mt-1.5"></div>
                                                    </div>
                                                </div>
                                                <div className="h-2 w-16 bg-zinc-700 rounded"></div>
                                            </div>
                                        ))}
                                        
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="h-2 w-20 bg-zinc-700/50 rounded"></div>
                                            <div className="flex gap-2">
                                                <div className="h-6 w-6 rounded-full bg-zinc-700/50"></div>
                                                <div className="h-6 w-6 rounded-full bg-zinc-700/50"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="absolute -z-10 -right-4 -bottom-6 w-20 h-20 bg-indigo-500/30 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute -z-10 -left-8 top-1/2 w-16 h-16 bg-blue-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: Command Bar Palette */}
            <section className="relative py-20 md:py-24 overflow-hidden bg-zinc-900/70">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl animate-pulse" style={{ animationDelay: '1.7s' }}></div>
                </div>
                
                <div className="mx-auto max-w-6xl px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Command Everything</span> With a Single Keystroke
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            Access all of Hypermail's powerful features instantly with our command palette.
                            No more digging through menus.
                        </p>
                    </div>
                    
                    <div className="relative max-w-4xl mx-auto opacity-0 animate-fadeIn" 
                        style={{ 
                            animationDelay: '0.6s', 
                            animationFillMode: 'forwards',
                            transform: `translateY(${Math.max(0, parallaxOffset)}px)`
                        }}>
                        {/* Command bar frame */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-30"></div>
                        <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden">
                            {/* Command bar header */}
                            <div className="flex items-center gap-2 border-b border-zinc-800 p-3">
                                <div className="flex items-center gap-2 bg-zinc-800 rounded-md px-3 py-2 flex-1">
                                    <Command className="h-4 w-4 text-zinc-400" />
                                    <input 
                                        type="text" 
                                        className="bg-transparent border-none outline-none text-zinc-300 text-sm placeholder-zinc-500 w-full" 
                                        placeholder="Type a command or search..."
                                        value="compose new email"
                                        readOnly
                                    />
                                </div>
                                <div className="flex gap-1 items-center text-xs text-zinc-500">
                                    <div className="bg-zinc-800 rounded px-1.5 py-0.5">⌘</div>
                                    <div className="bg-zinc-800 rounded px-1.5 py-0.5">K</div>
                                </div>
                            </div>
                            
                            {/* Command results */}
                            <div className="p-2">
                                <div className="p-2 text-xs font-medium text-zinc-500 uppercase">Actions</div>
                                
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between p-2 rounded-md bg-indigo-500/20 border border-indigo-500/30">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-500/20 p-1.5 rounded">
                                                <Mail className="h-4 w-4 text-indigo-400" />
                                            </div>
                                            <div className="text-sm text-white">Compose new email</div>
                                        </div>
                                        <div className="text-xs text-zinc-500">↵</div>
                                    </div>
                                    
                                    {[
                                        {icon: <Search className="h-4 w-4 text-zinc-400" />, text: "Search all emails"},
                                        {icon: <User className="h-4 w-4 text-zinc-400" />, text: "Go to contacts"},
                                        {icon: <Calendar className="h-4 w-4 text-zinc-400" />, text: "Schedule sending"},
                                        {icon: <Zap className="h-4 w-4 text-zinc-400" />, text: "Generate AI response"}
                                    ].map((item, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800/70 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-zinc-800/80 p-1.5 rounded">
                                                    {item.icon}
                                                </div>
                                                <div className="text-sm text-zinc-300">{item.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="p-2 text-xs font-medium text-zinc-500 uppercase mt-2">Recent Emails</div>
                                <div className="space-y-1">
                                    {[
                                        "Team Weekly Update - May 2025",
                                        "Product Launch Timeline"
                                    ].map((item, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800/70 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-zinc-800/80 p-1.5 rounded">
                                                    <MessageSquare className="h-4 w-4 text-zinc-400" />
                                                </div>
                                                <div className="text-sm text-zinc-300">{item}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Command bar footer */}
                            <div className="border-t border-zinc-800 p-2 flex justify-between items-center text-xs text-zinc-500">
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-1">
                                        <div className="bg-zinc-800 rounded px-1 py-0.5">↑</div>
                                        <div className="bg-zinc-800 rounded px-1 py-0.5">↓</div>
                                        <span>to navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="bg-zinc-800 rounded px-1 py-0.5">↵</div>
                                        <span>to select</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="bg-zinc-800 rounded px-1 py-0.5">Esc</div>
                                    <span>to close</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -z-10 -right-6 -bottom-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute -z-10 -left-10 top-10 w-24 h-24 bg-blue-500/15 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                    
                    <div className="flex justify-center mt-8">
                        <Button 
                            size="lg" 
                            className="bg-zinc-800 hover:bg-zinc-700 text-white border-none relative overflow-hidden group transition-all duration-300"
                            onClick={toggleCommandBar}
                        >
                            <Command className="h-4 w-4 mr-2" />
                            <span>Try the Command Bar</span>
                        </Button>
                    </div>
                </div>
            </section>

        
            
            {/* NEW SECTION: Left-Right Layout with Scroll Transitions */}
            <section className="relative py-24 overflow-hidden bg-zinc-950">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
                </div>
                
                <div className="mx-auto max-w-6xl px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fadeIn" 
                        style={{ 
                            animationDelay: '0.3s', 
                            animationFillMode: 'forwards' 
                        }}>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Designed For</span> 
                            <span className="text-white"> How You Work</span>
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            Hypermail adapts to your workflow, not the other way around.
                        </p>
                    </div>
                    
                    {/* Feature panels - these will have scroll transitions */}
                    <div className="space-y-32">
                        {/* First Feature */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6 opacity-0 animate-slideFromLeft" 
                                style={{ 
                                    animationPlayState: scrollY > 300 ? 'running' : 'paused',
                                    animationFillMode: 'forwards'
                                }}>
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
                                {/* <Button 
                                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                                >
                                    Learn More <ChevronRight className="ml-1 h-4 w-4" />
                                </Button> */}
                            </div>
                            
                            <div className="relative opacity-0 animate-slideFromRight"
                                style={{ 
                                    animationPlayState: scrollY > 300 ? 'running' : 'paused',
                                    animationFillMode: 'forwards'
                                }}>
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
                                                <div key={idx} className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-between transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-${email.color}-500`}></div>
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
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="relative order-2 md:order-1 opacity-0 animate-slideFromLeft"
                                style={{ 
                                    animationPlayState: scrollY > 800 ? 'running' : 'paused',
                                    animationFillMode: 'forwards'
                                }}>
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
                                        
                                        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 mb-4">
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
                                        
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
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
                                                        <button key={idx} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full transition-colors">
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
                            
                            <div className="space-y-6 order-1 md:order-2 opacity-0 animate-slideFromRight"
                                style={{ 
                                    animationPlayState: scrollY > 800 ? 'running' : 'paused',
                                    animationFillMode: 'forwards'
                                }}>
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
                                        <li key={idx} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* <Button 
                                    className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300"
                                >
                                    See AI In Action <ChevronRight className="ml-1 h-4 w-4" />
                                </Button> */}
                            </div>
                        </div>
                        
                        {/* Third Feature */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6 opacity-0 animate-slideFromLeft"
                                style={{ 
                                    animationPlayState: scrollY > 1300 ? 'running' : 'paused',
                                    animationFillMode: 'forwards'
                                }}>
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
                                        <li key={idx} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* <Button 
                                    className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                                >
                                    Never Miss Again <ChevronRight className="ml-1 h-4 w-4" />
                                </Button> */}
                            </div>
                            
                            <div className="relative opacity-0 animate-slideFromRight"
                                style={{ 
                                    animationPlayState: scrollY > 1300 ? 'running' : 'paused',
                                    animationFillMode: 'forwards'
                                }}>
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
                                            <div key={idx} className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer">
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
                                        
                                        <div className="text-xs text-zinc-500 text-center pt-2">
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
            
            
            {/* Command bar modal */}
            {commandBarOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden animate-scaleUp">
                        <div className="flex items-center gap-2 border-b border-zinc-800 p-3">
                            <div className="flex items-center gap-2 bg-zinc-800 rounded-md px-3 py-2 flex-1">
                                <Command className="h-4 w-4 text-zinc-400" />
                                <input 
                                    type="text" 
                                    className="bg-transparent border-none outline-none text-zinc-300 text-sm placeholder-zinc-500 w-full" 
                                    placeholder="Type a command or search..."
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-1 items-center text-xs text-zinc-500">
                                <div className="bg-zinc-800 rounded px-1.5 py-0.5">⌘</div>
                                <div className="bg-zinc-800 rounded px-1.5 py-0.5">K</div>
                            </div>
                        </div>
                        
                        <div className="p-2">
                            <div className="p-2 text-xs font-medium text-zinc-500 uppercase">Actions</div>
                            
                            <div className="space-y-1">
                                {[
                                    {icon: <Mail className="h-4 w-4 text-zinc-400" />, text: "Compose new email"},
                                    {icon: <Search className="h-4 w-4 text-zinc-400" />, text: "Search all emails"},
                                    {icon: <User className="h-4 w-4 text-zinc-400" />, text: "Go to contacts"},
                                    {icon: <Calendar className="h-4 w-4 text-zinc-400" />, text: "Schedule sending"},
                                    {icon: <Zap className="h-4 w-4 text-zinc-400" />, text: "Generate AI response"},
                                    {icon: <Settings className="h-4 w-4 text-zinc-400" />, text: "Open settings"},
                                    {icon: <Layout className="h-4 w-4 text-zinc-400" />, text: "Change layout"},
                                    {icon: <ClipboardList className="h-4 w-4 text-zinc-400" />, text: "View analytics"}
                                ].map((item, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800/70 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-zinc-800/80 p-1.5 rounded">
                                                {item.icon}
                                            </div>
                                            <div className="text-sm text-zinc-300">{item.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="border-t border-zinc-800 p-2 flex justify-between items-center text-xs text-zinc-500">
                            <div className="flex gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="bg-zinc-800 rounded px-1 py-0.5">↑</div>
                                    <div className="bg-zinc-800 rounded px-1 py-0.5">↓</div>
                                    <span>to navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="bg-zinc-800 rounded px-1 py-0.5">↵</div>
                                    <span>to select</span>
                                </div>
                            </div>
                            <button 
                                className="bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded transition-colors"
                                onClick={toggleCommandBar}
                            >
                                <div className="flex items-center gap-1">
                                    <div className="rounded px-1 py-0.5">Esc</div>
                                    <span>to close</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(-50%) translateX(0); }
                    50% { transform: translateY(-50%) translateX(10px); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideFromLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes slideFromRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                
                .animate-slideFromLeft {
                    animation: slideFromLeft 0.8s ease-out forwards;
                }
                
                .animate-slideFromRight {
                    animation: slideFromRight 0.8s ease-out forwards;
                }
                
                .animate-scaleUp {
                    animation: scaleUp 0.3s ease-out forwards;
                }
                
                .animate-pulse {
                    animation: pulse 3s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    )
}