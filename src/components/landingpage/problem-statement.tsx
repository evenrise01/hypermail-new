'use client'

import { useState, useEffect, useRef } from 'react'
import { Mail, Clock, Target, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const HypermailProblemStatement = () => {
    const [scrollY, setScrollY] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isInView, setIsInView] = useState(false)
    
    // Refs for animated elements
    const sectionRef = useRef(null)
    const contentRef = useRef(null)
    const imageRef = useRef(null)
    const featureRefs = useRef([])
    
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        // Intersection Observer for the entire section
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    setIsInView(entry.isIntersecting)
                })
            },
            { threshold: 0.1 } // Trigger when 10% of the section is visible
        )
        
        if (sectionRef.current) {
            sectionObserver.observe(sectionRef.current)
        }
        
        return () => {
            if (sectionRef.current) {
                sectionObserver.unobserve(sectionRef.current)
            }
        }
    }, [])
    
    // Staggered animation for features
    useEffect(() => {
        const featureObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Add a staggered delay for each feature
                        setTimeout(() => {
                            entry.target.classList.add('animate-feature-in')
                            entry.target.classList.remove('opacity-0', 'translate-y-8')
                        }, index * 150)
                    } else {
                        entry.target.classList.remove('animate-feature-in')
                        entry.target.classList.add('opacity-0', 'translate-y-8')
                    }
                })
            },
            { threshold: 0.2, rootMargin: "-50px" }
        )
        
        featureRefs.current.forEach(ref => {
            if (ref) {
                featureObserver.observe(ref)
            }
        })
        
        return () => {
            featureRefs.current.forEach(ref => {
                if (ref) {
                    featureObserver.unobserve(ref)
                }
            })
        }
    }, [])
    
    const parallaxOffset = scrollY * 0.05
    
    // Calculate opacity based on scroll position
    const calculateOpacity = (baseOpacity = 1) => {
        if (!sectionRef.current) return baseOpacity
        
        const rect = sectionRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        
        // When section is entering from bottom
        if (rect.top < viewportHeight && rect.top > 0) {
            return baseOpacity * (1 - (rect.top / viewportHeight) * 0.8)
        }
        // When section is leaving from top
        else if (rect.bottom < viewportHeight && rect.bottom > 0) {
            return baseOpacity * (rect.bottom / viewportHeight)
        }
        // When section is fully in view
        else if (rect.top <= 0 && rect.bottom >= viewportHeight) {
            return baseOpacity
        }
        // When section is not in view
        else {
            return 0
        }
    }
    
    // Add a feature to the refs
    const addToFeatureRefs = (el, index) => {
        if (el && !featureRefs.current.includes(el)) {
            featureRefs.current[index] = el
        }
    }

    return (
        <section 
            ref={sectionRef}
            className={`relative py-20 md:py-32 overflow-hidden transition-opacity duration-700 ease-in-out ${isInView ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Background gradients with animation controlled by scroll */}
            <div className="absolute inset-0 overflow-hidden transition-all duration-1000" 
                style={{ opacity: calculateOpacity(0.8) }}>
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-16 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" 
                    style={{ 
                        animationDelay: '1s',
                        transform: `translate(${scrollY * -0.02}px, ${scrollY * 0.01}px)` 
                    }}></div>
                <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl animate-pulse" 
                    style={{ 
                        animationDelay: '2s',
                        transform: `translate(${scrollY * 0.01}px, ${scrollY * -0.015}px)` 
                    }}></div>
            </div>
            
            <div className="mx-auto max-w-6xl px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
                    <div 
                        ref={contentRef}
                        className={`space-y-8 transition-all duration-1000 ease-out ${isInView ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
                        style={{ transitionDelay: '200ms' }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                            <span className="text-white">Email is the </span>
                            <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent inline-block">
                                biggest problem
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent inline-block">
                                hiding in plain sight
                            </span>
                        </h1>
                        
                        <p className={`text-zinc-400 text-lg md:text-xl max-w-lg transition-all duration-700 ease-out ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                           style={{ transitionDelay: '300ms' }}>
                            We all spend hours on email. But we often reply late, and sometimes don't even reply.
                            We then end up losing deals, blocking our teams, and missing our goals.
                        </p>
                        
                        <p className={`text-zinc-400 text-lg md:text-xl max-w-lg transition-all duration-700 ease-out ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                           style={{ transitionDelay: '400ms' }}>
                            It's not anybody's fault. Email itself has not changed in decades.
                            <span className="text-white font-medium"> With Hypermail, this all changes.</span>
                        </p>
                        
                        <div className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 ease-out ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                             style={{ transitionDelay: '500ms' }}>
                            <Button 
                                size="lg" 
                                className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none relative overflow-hidden group transition-all duration-300 ${isInView ? 'scale-100' : 'scale-95'}`}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <span className="relative z-10">Get Started Free</span>
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className={`border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-all duration-300 ${isInView ? 'scale-100' : 'scale-95'}`}
                                style={{ transitionDelay: '50ms' }}
                            >
                                See How It Works
                            </Button>
                        </div>
                        
                        <div className={`grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-800 mt-10 transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}
                             style={{ transitionDelay: '600ms' }}>
                            <div 
                                ref={(el) => addToFeatureRefs(el, 0)}
                                className="space-y-2 transition-all duration-500 opacity-0 translate-y-8 hover:translate-y-[-4px]"
                            >
                                <div className="flex items-center gap-2">
                                    <Mail className="size-4 text-blue-400" />
                                    <h3 className="text-sm font-medium text-white">Smart Inbox</h3>
                                </div>
                                <p className="text-zinc-400 text-sm">AI-powered email categorization and prioritization</p>
                            </div>
                            <div 
                                ref={(el) => addToFeatureRefs(el, 1)}
                                className="space-y-2 transition-all duration-500 opacity-0 translate-y-8 hover:translate-y-[-4px]"
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-indigo-400" />
                                    <h3 className="text-sm font-medium text-white">Save Time</h3>
                                </div>
                                <p className="text-zinc-400 text-sm">Cut your email time by 50% with AI assistance</p>
                            </div>
                            <div 
                                ref={(el) => addToFeatureRefs(el, 2)}
                                className="space-y-2 col-span-2 sm:col-span-1 transition-all duration-500 opacity-0 translate-y-8 hover:translate-y-[-4px]"
                            >
                                <div className="flex items-center gap-2">
                                    <Target className="size-4 text-purple-400" />
                                    <h3 className="text-sm font-medium text-white">Never Miss</h3>
                                </div>
                                <p className="text-zinc-400 text-sm">Automated follow-ups and response tracking</p>
                            </div>
                        </div>
                    </div>
                    
                    <div 
                        ref={imageRef}
                        className={`relative transition-all duration-1000 ease-out ${isInView ? 'translate-x-0 opacity-100 rotate-0' : 'translate-x-12 opacity-0 rotate-2'}`}
                        style={{
                            transform: isInView ? `translateY(${-parallaxOffset}px)` : 'translateY(20px) translateX(12px) rotate(2deg)',
                            transitionDelay: '400ms'
                        }}
                    >
                        <div 
                            className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse transition-opacity duration-700 ${isInView ? 'opacity-30' : 'opacity-0'}`}
                        ></div>
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
                                    <div className={`flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-all duration-500 hover:bg-blue-500/15 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                                         style={{ transitionDelay: '600ms' }}>
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
                                            className={`p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex justify-between items-center transition-all duration-500 hover:bg-zinc-800/70 hover:border-zinc-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                            style={{ transitionDelay: `${600 + (item * 200)}ms` }}
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
                                    
                                    <div className={`mt-4 flex items-center justify-between transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                         style={{ transitionDelay: '1200ms' }}>
                                        <div className="h-2 w-20 bg-zinc-700/50 rounded"></div>
                                        <div className="flex gap-2">
                                            <div className="h-6 w-6 rounded-full bg-zinc-700/50"></div>
                                            <div className="h-6 w-6 rounded-full bg-zinc-700/50"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative elements with scroll-based movement */}
                        <div 
                            className={`absolute -z-10 -right-4 -bottom-6 w-20 h-20 bg-indigo-500/30 rounded-full blur-xl animate-pulse transition-all duration-700 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                            style={{ 
                                transform: `translate(${scrollY * 0.03}px, ${scrollY * -0.02}px) scale(${isInView ? 1 : 1})`,
                                transitionDelay: '200ms'
                            }}
                        ></div>
                        <div 
                            className={`absolute -z-10 -left-8 top-1/2 w-16 h-16 bg-blue-500/20 rounded-full blur-lg animate-pulse transition-all duration-700 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-100'}`}
                            style={{ 
                                animationDelay: '1.0s',
                                transform: `translate(${scrollY * -0.02}px, ${scrollY * 0.02}px) scale(${isInView ? 1 : 1})`,
                                transitionDelay: '200ms'
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            
            {/* Add this keyframes animation to your global CSS */}
            <style jsx>{`
                @keyframes featureIn {
                    0% {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-feature-in {
                    animation: featureIn 0.5s forwards ease-out;
                }
            `}</style>
        </section>
    )
}

export default HypermailProblemStatement