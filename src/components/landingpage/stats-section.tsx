'use client'
import { useRef } from 'react'
import { Mail, Star, Zap } from 'lucide-react'
import CountUp from 'react-countup'
import { motion, useInView } from 'framer-motion'

export default function StatsSection() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
    
    const stats = [
        { 
            icon: Star, 
            value: 2400, 
            label: "Active Users", 
            prefix: "+",
            gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
        },
        { 
            icon: Mail, 
            value: 98.5, 
            label: "Email Efficiency", 
            suffix: "%",
            gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
        },
        { 
            icon: Zap, 
            value: 10000, 
            label: "Emails Optimized Daily", 
            prefix: "+",
            gradient: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <section 
            ref={sectionRef}
            className="py-20 md:py-32 relative overflow-hidden"
        >
            {/* Futuristic background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/80 dark:to-zinc-950"></div>
            <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-30">
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute top-full -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>
            </div>
            
            <div className="relative mx-auto max-w-5xl space-y-16 px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 mx-auto max-w-2xl space-y-6 text-center"
                >
                    <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Hypermail by the Numbers
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Join thousands of professionals who trust Hypermail to revolutionize their email experience with cutting-edge AI technology.
                    </p>
                </motion.div>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid gap-8 md:grid-cols-3"
                >
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="relative h-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-transparent hover:bg-gradient-to-b hover:from-white/80 hover:to-white/20 dark:hover:from-zinc-900/80 dark:hover:to-zinc-900/20">
                                {/* Animated border on hover */}
                                <div 
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{
                                        background: stat.gradient,
                                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        maskComposite: 'exclude',
                                        padding: '1px',
                                        zIndex: -1
                                    }}
                                />
                                
                                {/* Icon with gradient background */}
                                <div 
                                    className="mx-auto size-14 mb-6 rounded-full p-3 flex items-center justify-center"
                                    style={{ background: stat.gradient }}
                                >
                                    <stat.icon className="size-8 text-white" />
                                </div>
                                
                                {/* Animated stat value */}
                                <div className="text-4xl font-bold mb-2 text-zinc-900 dark:text-white">
                                    {isInView && (
                                        <CountUp
                                            start={0}
                                            end={stat.value}
                                            duration={2.5}
                                            decimals={stat.suffix ? 1 : 0}
                                            suffix={stat.suffix || ''}
                                            prefix={stat.prefix || ''}
                                            className="tabular-nums"
                                        />
                                    )}
                                </div>
                                
                                <p className="text-zinc-600 dark:text-zinc-400">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6 }}
                    className="pt-4 text-center"
                >
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Numbers updated as of April 2025
                    </p>
                </motion.div>
            </div>
        </section>
    )
}