'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'

export default function Testimonials() {
    const [hoveredCard, setHoveredCard] = useState(null);
    
    const testimonials = [
        {
            id: 1,
            company: {
                name: "Acme Corp",
                logo: "/api/placeholder/120/24"
            },
            quote: "Hypermail has transformed our team's communication workflow. The AI-powered features have cut our email processing time by 60%. It's like having a personal assistant that understands exactly what we need.",
            author: {
                name: "Shekinah Tshiokufila",
                role: "Head of Operations",
                avatar: "https://tailus.io/images/reviews/shekinah.webp"
            },
            size: "large"
        },
        {
            id: 2,
            quote: "The smart categorization and priority inbox features are game-changers. Hypermail seems to know which emails need my attention before I do.",
            author: {
                name: "Jonathan Yombo",
                role: "Product Manager",
                avatar: "https://tailus.io/images/reviews/jonathan.webp"
            },
            size: "medium"
        },
        {
            id: 3,
            quote: "Hypermail's AI email drafting saved me countless hours. It captures my tone perfectly.",
            author: {
                name: "Yucel Faruksahan",
                role: "Content Strategist",
                avatar: "https://tailus.io/images/reviews/yucel.webp"
            },
            size: "small"
        },
        {
            id: 4,
            quote: "The most intuitive email client I've ever used. The future of email is definitely here.",
            author: {
                name: "Rodrigo Aguilar",
                role: "UX Designer",
                avatar: "https://tailus.io/images/reviews/rodrigo.webp"
            },
            size: "small"
        }
    ];

    return (
        <section className="py-24 md:py-32 overflow-hidden">
            <div className="mx-auto max-w-6xl px-6">
                <div className="relative z-10 mx-auto max-w-2xl mb-16 text-center">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">Redefining</span> email for the AI age
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto">
                        Discover why thousands of professionals are switching to Hypermail for a smarter, more intuitive email experience.
                    </p>
                </div>

                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-8">
                    {testimonials.map((testimonial) => (
                        <Card 
                            key={testimonial.id}
                            className={`bg-white/50 dark:bg-zinc-900/50 backdrop-blur-lg border border-zinc-100 dark:border-zinc-800 rounded-2xl transition-all duration-300 overflow-hidden ${
                                testimonial.size === 'large' ? 'lg:col-span-4 lg:row-span-2' : 
                                testimonial.size === 'medium' ? 'lg:col-span-4' : 'lg:col-span-2'
                            } ${
                                hoveredCard === testimonial.id ? 'shadow-lg dark:shadow-zinc-900/50 scale-[1.02]' : 'shadow-md'
                            }`}
                            onMouseEnter={() => setHoveredCard(testimonial.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {testimonial.company && (
                                <CardHeader className="pb-2">
                                    <img 
                                        className="h-6 w-auto dark:invert" 
                                        src={testimonial.company.logo} 
                                        alt={`${testimonial.company.name} Logo`} 
                                        height="24" 
                                        width="auto" 
                                    />
                                </CardHeader>
                            )}
                            <CardContent className="h-full pt-4">
                                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-5">
                                    <p className={`
                                        ${testimonial.size === 'large' ? 'text-xl' : ''} 
                                        font-medium leading-relaxed text-zinc-800 dark:text-zinc-100
                                    `}>
                                        {testimonial.quote}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <div className={`relative ${
                                            hoveredCard === testimonial.id ? 'animate-pulse-subtle' : ''
                                        }`}>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full -m-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                            <Avatar className="size-10 border-2 border-white dark:border-zinc-800 relative">
                                                <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
                                                <AvatarFallback>{testimonial.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                        </div>

                                        <div>
                                            <cite className="text-sm font-medium not-italic text-zinc-900 dark:text-white">
                                                {testimonial.author.name}
                                            </cite>
                                            <span className="text-zinc-500 dark:text-zinc-400 block text-sm">
                                                {testimonial.author.role}
                                            </span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}