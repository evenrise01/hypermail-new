"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Testimonials() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const testimonials = [
    {
      id: 1,
      company: {
        name: "Hypermail",
        logo: "gemini.svg",
      },
      quote:
        "Hypermail has transformed our team's communication workflow. The AI-powered features have cut our email processing time by 60%. It's like having a personal assistant that understands exactly what we need.",
      author: {
        name: "Shekinah Tshiokufila",
        role: "Head of Operations",
        avatar: "https://tailus.io/images/reviews/shekinah.webp",
      },
      size: "large",
    },
    {
      id: 2,
      quote:
        "The smart categorization and priority inbox features are game-changers. Hypermail seems to know which emails need my attention before I do.",
      author: {
        name: "Jonathan Yombo",
        role: "Product Manager",
        avatar: "https://tailus.io/images/reviews/jonathan.webp",
      },
      size: "medium",
    },
    {
      id: 3,
      quote:
        "Hypermail's AI email drafting saved me countless hours. It captures my tone perfectly.",
      author: {
        name: "Yucel Faruksahan",
        role: "Content Strategist",
        avatar: "https://tailus.io/images/reviews/yucel.webp",
      },
      size: "small",
    },
    {
      id: 4,
      quote:
        "The most intuitive email client I've ever used. The future of email is definitely here.",
      author: {
        name: "Rodrigo Aguilar",
        role: "UX Designer",
        avatar: "https://tailus.io/images/reviews/rodrigo.webp",
      },
      size: "small",
    },
  ];

  return (
    <section className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative z-10 mx-auto mb-16 max-w-2xl text-center">
          <div className="absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"></div>
          <h2 className="mb-6 text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Redefining
            </span>{" "}
            email for the AI age
          </h2>
          <p className="mx-auto max-w-xl text-lg text-zinc-400">
            Discover why thousands of professionals are switching to Hypermail
            for a smarter, more intuitive email experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className={`overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-lg transition-all duration-300 ${
                testimonial.size === "large"
                  ? "lg:col-span-4 lg:row-span-2"
                  : testimonial.size === "medium"
                    ? "lg:col-span-4"
                    : "lg:col-span-2"
              } ${
                hoveredCard === testimonial.id
                  ? "scale-[1.02] shadow-zinc-900/50"
                  : "shadow-md"
              }`}
              onMouseEnter={() => setHoveredCard(testimonial.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {testimonial.company && (
                <CardHeader className="pb-2">
                  <img
                    className="h-6 w-auto invert"
                    src={testimonial.company.logo}
                    alt={`${testimonial.company.name} Logo`}
                    height="24"
                    width="auto"
                  />
                </CardHeader>
              )}
              <CardContent className="h-full pt-4">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-5">
                  <p
                    className={` ${testimonial.size === "large" ? "text-xl" : ""} leading-relaxed font-medium text-zinc-100`}
                  >
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className={`relative ${
                        hoveredCard === testimonial.id
                          ? "animate-pulse-subtle"
                          : ""
                      }`}
                    >
                      <div className="absolute inset-0 -m-0.5 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <Avatar className="relative size-10 border-2 border-zinc-800">
                        <AvatarImage
                          src={testimonial.author.avatar}
                          alt={testimonial.author.name}
                        />
                        <AvatarFallback>
                          {testimonial.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div>
                      <cite className="text-sm font-medium text-white not-italic">
                        {testimonial.author.name}
                      </cite>
                      <span className="block text-sm text-zinc-400">
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
  );
}
