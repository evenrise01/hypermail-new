"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Clock, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HypermailProblemStatement = () => {
  // TODO: Implement hover effects
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for animated elements
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Simple staggered animation for features
  const featureItems = [
    {
      icon: <Mail className="size-4 text-blue-400" />,
      title: "Smart Inbox",
      description: "AI-powered email categorization and prioritization",
    },
    {
      icon: <Clock className="size-4 text-indigo-400" />,
      title: "Save Time",
      description: "Cut your email time by 50% with AI assistance",
    },
    {
      icon: <Target className="size-4 text-purple-400" />,
      title: "Never Miss",
      description: "Automated follow-ups and response tracking",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-32"
      id="product"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"></div>
        <div
          className="absolute bottom-0 left-16 h-80 w-80 animate-pulse rounded-full bg-indigo-600/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/3 h-64 w-64 animate-pulse rounded-full bg-purple-600/10 blur-3xl"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-8">
          <div ref={contentRef} className="space-y-8">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-white">Email is the </span>
              <span className="inline-block bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
                biggest problem
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                hiding in plain sight
              </span>
            </h1>

            <p className="max-w-lg text-lg text-zinc-400 md:text-xl">
              We all spend hours on email. But we often reply late, and
              sometimes don&apos;t even reply. We then end up losing deals,
              blocking our teams, and missing our goals.
            </p>

            <p className="max-w-lg text-lg text-zinc-400 md:text-xl">
              It&apos;s not anybody&apos;s fault. Email itself has not changed in
              decades.
              <span className="font-medium text-white">
                {" "}
                With Hypermail, this all changes.
              </span>
            </p>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                size="lg"
                className="group relative overflow-hidden border-none bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Link href="/sign-up">
                  <span className="relative z-10">Get Started Free</span>
                  <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-indigo-600 to-blue-600 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700 text-zinc-300 transition-all duration-300 hover:bg-zinc-800"
              >
                See How It Works
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-zinc-800 pt-6 sm:grid-cols-3">
              {featureItems.map((feature, index) => (
                <div
                  key={index}
                  className={`space-y-2 transition-all duration-500 will-change-transform hover:translate-y-[-4px] ${
                    isInView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${index * 100 + 300}ms`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {feature.icon}
                    <h3 className="text-sm font-medium text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div ref={imageRef} className="relative will-change-transform">
            <div
              className={`absolute -inset-0.5 animate-pulse rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 blur ${
                isInView ? "opacity-30" : "opacity-0"
              } transition-opacity duration-700`}
            ></div>
            <div className="relative z-10 overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/90 shadow-xl transition-all duration-300 hover:border-zinc-600/60 hover:shadow-indigo-500/10">
              <div className="flex h-10 items-center gap-2 bg-zinc-800/70 px-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-zinc-600"></div>
                  <div className="h-3 w-3 rounded-full bg-zinc-600"></div>
                  <div className="h-3 w-3 rounded-full bg-zinc-600"></div>
                </div>
                <div className="flex-1 text-center text-xs text-zinc-400">
                  Hypermail - Smart Inbox
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 transition-all duration-500 hover:bg-blue-500/15 ${
                      isInView
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0"
                    }`}
                    style={{ transitionDelay: "300ms" }}
                  >
                    <div className="animate-pulse rounded-full bg-blue-500/20 p-2">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-sm text-zinc-300">
                      <span className="font-medium text-white">
                        AI Assistant
                      </span>
                      : I&apos;ve drafted 3 responses for your priority emails
                    </div>
                  </div>

                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={`flex items-center justify-between rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-3 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-800/70 ${
                        isInView
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                      style={{ transitionDelay: `${300 + item * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-700"></div>
                        <div>
                          <div className="h-3 w-24 rounded bg-zinc-700"></div>
                          <div className="mt-1.5 h-2 w-32 rounded bg-zinc-700/70"></div>
                        </div>
                      </div>
                      <div className="h-2 w-16 rounded bg-zinc-700"></div>
                    </div>
                  ))}

                  <div
                    className={`mt-4 flex items-center justify-between transition-all duration-500 ${
                      isInView
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                    style={{ transitionDelay: "600ms" }}
                  >
                    <div className="h-2 w-20 rounded bg-zinc-700/50"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 rounded-full bg-zinc-700/50"></div>
                      <div className="h-6 w-6 rounded-full bg-zinc-700/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements - only on desktop */}
            {!isMobile && (
              <>
                <div
                  className={`absolute -right-4 -bottom-6 -z-10 h-20 w-20 animate-pulse rounded-full bg-indigo-500/30 blur-xl transition-opacity duration-700 ${
                    isInView ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: "300ms" }}
                ></div>
                <div
                  className={`absolute top-1/2 -left-8 -z-10 h-16 w-16 animate-pulse rounded-full bg-blue-500/20 blur-lg transition-opacity duration-700 ${
                    isInView ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: "1.5s",
                    transitionDelay: "400ms",
                  }}
                ></div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HypermailProblemStatement;
