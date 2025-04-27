import { useState, useEffect, useRef } from 'react'
import { Mail, MessageSquare, Search, Command, User, Calendar, Zap, ClipboardList, Layout, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const HypermailCommandBarFeature = () => {
    const [scrollY, setScrollY] = useState(0)
    const [commandBarOpen, setCommandBarOpen] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const descriptionRef = useRef(null)
    const commandBarRef = useRef(null)
    const buttonRef = useRef(null)

    // Handle scroll position for parallax effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Intersection Observer for detecting when section is in viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries
                setIsInView(entry!.isIntersecting)
            },
            { 
                threshold: 0.15, // Trigger when 15% of the element is visible
                rootMargin: '-50px 0px' // Start animation slightly before element enters viewport
            }
        )

        const currentRef = sectionRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [])

    // Animate elements when section comes into view
    useEffect(() => {
        if (isInView) {
            // Add staggered animations to elements
            if (headingRef.current) {
                headingRef.current.style.opacity = '1'
                headingRef.current.style.transform = 'translateY(0)'
            }
            
            setTimeout(() => {
                if (descriptionRef.current) {
                    descriptionRef.current.style.opacity = '1'
                    descriptionRef.current.style.transform = 'translateY(0)'
                }
            }, 200)
            
            setTimeout(() => {
                if (commandBarRef.current) {
                    commandBarRef.current.style.opacity = '1'
                    commandBarRef.current.style.transform = 'translateY(0) scale(1)'
                }
            }, 400)
            
            setTimeout(() => {
                if (buttonRef.current) {
                    buttonRef.current.style.opacity = '1'
                    buttonRef.current.style.transform = 'translateY(0)'
                }
            }, 700)
        } else {
            // Optional: Reset animations when scrolling away
            if (headingRef.current) {
                headingRef.current.style.opacity = '0'
                headingRef.current.style.transform = 'translateY(20px)'
            }
            
            if (descriptionRef.current) {
                descriptionRef.current.style.opacity = '0'
                descriptionRef.current.style.transform = 'translateY(20px)'
            }
            
            if (commandBarRef.current) {
                commandBarRef.current.style.opacity = '0'
                commandBarRef.current.style.transform = 'translateY(30px) scale(0.98)'
            }
            
            if (buttonRef.current) {
                buttonRef.current.style.opacity = '0'
                buttonRef.current.style.transform = 'translateY(20px)'
            }
        }
    }, [isInView])

    const toggleCommandBar = () => {
        setCommandBarOpen(!commandBarOpen)
    }
    
    const parallaxOffset = scrollY * 0.005
    
    // Calculate how far user has scrolled within section for advanced effects
    const calculateScrollProgress = () => {
        if (!sectionRef.current) return 0
        
        const rect = sectionRef.current.getBoundingClientRect()
        const sectionTop = rect.top
        const sectionHeight = rect.height
        const viewportHeight = window.innerHeight
        
        // Normalized value from 0 to 1, where:
        // 0 = section just entered viewport from bottom
        // 0.5 = section is centered in viewport
        // 1 = section is about to exit viewport from top
        return Math.min(Math.max((viewportHeight - sectionTop) / (viewportHeight + sectionHeight), 0), 1)
    }
    
    const scrollProgress = calculateScrollProgress()
    const rotationAmount = isInView ? scrollProgress * 2 : 0 // Subtle rotation effect
    
    return (
        <section 
            ref={sectionRef}
            className="relative py-20 md:py-24 overflow-hidden bg-zinc-900/70 transition-all duration-700"
            style={{
                perspective: '1000px'
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div 
                    className="absolute top-0 left-1/3 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
                    style={{
                        transform: isInView ? `translateY(${scrollProgress * 20}px)` : 'translateY(20px)',
                        opacity: isInView ? 0.8 : 0.3,
                        transition: 'transform 0.8s ease-out, opacity 1.2s ease-out'
                    }}
                ></div>
                <div 
                    className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl animate-pulse" 
                    style={{ 
                        animationDelay: '1.7s',
                        transform: isInView ? `translateY(${-scrollProgress * 30}px)` : 'translateY(30px)',
                        opacity: isInView ? 0.7 : 0.2,
                        transition: 'transform 0.8s ease-out, opacity 1.2s ease-out'
                    }}
                ></div>
            </div>
            
            <div className="mx-auto max-w-6xl px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 
                        ref={headingRef}
                        className="text-3xl md:text-4xl font-semibold mb-6"
                        style={{ 
                            opacity: 0,
                            transform: 'translateY(20px)',
                            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' 
                        }}
                    >
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Command Everything</span> With a Single Keystroke
                    </h2>
                    <p 
                        ref={descriptionRef}
                        className="text-zinc-400 text-lg"
                        style={{ 
                            opacity: 0,
                            transform: 'translateY(20px)',
                            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' 
                        }}
                    >
                        Access all of Hypermail's powerful features instantly with our command palette.
                        No more digging through menus.
                    </p>
                </div>
                
                <div 
                    ref={commandBarRef}
                    className="relative max-w-3xl mx-auto"
                    style={{ 
                        opacity: 0,
                        transform: 'translateY(30px) scale(0.98)',
                        transition: 'opacity 1s ease-out, transform 1s ease-out',
                        transformStyle: 'preserve-3d',
                        transform: isInView 
                            ? `translateY(${Math.max(0, parallaxOffset)}px) rotateX(${rotationAmount}deg)` 
                            : 'translateY(30px) rotateX(5deg) scale(0.98)'
                    }}
                >
                    {/* Command bar frame */}
                    <div 
                        className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-30"
                        style={{
                            transform: isInView ? 'scale(1.03)' : 'scale(1)',
                            opacity: isInView ? 0.4 : 0.2,
                            transition: 'transform 1.2s ease-out, opacity 1.2s ease-out'
                        }}
                    ></div>
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
                                <div 
                                    className="flex items-center justify-between p-2 rounded-md bg-indigo-500/20 border border-indigo-500/30"
                                    style={{
                                        animation: isInView ? 'pulse 2s infinite' : 'none',
                                        boxShadow: isInView ? '0 0 10px rgba(99, 102, 241, 0.2)' : 'none'
                                    }}
                                >
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
                                        style={{
                                            opacity: isInView ? 1 : 0.5,
                                            transform: isInView ? 'translateX(0)' : 'translateX(20px)',
                                            transition: `opacity 0.5s ease-out ${index * 0.1 + 0.2}s, transform 0.5s ease-out ${index * 0.1 + 0.2}s`
                                        }}
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
                                        style={{
                                            opacity: isInView ? 1 : 0.5,
                                            transform: isInView ? 'translateX(0)' : 'translateX(-20px)',
                                            transition: `opacity 0.5s ease-out ${index * 0.1 + 0.6}s, transform 0.5s ease-out ${index * 0.1 + 0.6}s`
                                        }}
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
                    <div 
                        className="absolute -z-10 -right-6 -bottom-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse"
                        style={{
                            transform: isInView ? `scale(${1 + scrollProgress * 0.15})` : 'scale(0.8)',
                            opacity: isInView ? 0.7 * (1 - scrollProgress * 0.3) : 0.2,
                            transition: 'transform 1s ease-out, opacity 1s ease-out'
                        }}
                    ></div>
                    <div 
                        className="absolute -z-10 -left-6 top-10 w-20 h-20 bg-blue-500/15 rounded-full blur-lg animate-pulse" 
                        style={{ 
                            animationDelay: '2s',
                            transform: isInView ? `scale(${1 + scrollProgress * 0.2})` : 'scale(0.8)',
                            opacity: isInView ? 0.6 * (1 - scrollProgress * 0.4) : 0.2,
                            transition: 'transform 1s ease-out, opacity 1s ease-out'
                        }}
                    ></div>
                </div>
                
                <div className="flex justify-center mt-12">
                    <Button 
                        ref={buttonRef}
                        size="lg" 
                        className="bg-zinc-800 hover:bg-zinc-700 text-white border-none relative overflow-hidden group transition-all duration-300 cursor-pointer"
                        onClick={toggleCommandBar}
                        style={{ 
                            opacity: 0,
                            transform: 'translateY(20px)',
                            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                        }}
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <Command className="h-4 w-4 mr-2" />
                        <span>Try the Command Bar</span>
                    </Button>
                </div>
            </div>
            {/* Command bar modal */}
            {commandBarOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
                    <div 
                        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden"
                        style={{
                            animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
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
                                        style={{
                                            animation: `fadeInRight 0.3s ease-out forwards ${index * 0.03}s`
                                        }}
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

            <style jsx>{`
                @keyframes scaleUp {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
                    70% { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }
            `}</style>
        </section>
    )
}

export default HypermailCommandBarFeature