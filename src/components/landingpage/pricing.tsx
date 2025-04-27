"use client";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  // Animation for hover effects
  const [hoveredFree, setHoveredFree] = useState(false);
  const [hoveredPro, setHoveredPro] = useState(false);

  // Calculate pro price based on billing cycle
  const proPrice = isYearly ? 14 : 19;
  const proSaving = isYearly ? "Save 25%" : "";

  return (
    <section className="bg-gradient-to-b py-16 md:py-32 from-zinc-900 to-zinc-950">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="bg-gradient-to-r bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent lg:text-5xl from-blue-400 to-indigo-500">
            Choose Your Hypermail Experience
          </h1>
          <p className="text-zinc-400">
            Unlock the future of email communication with plans designed for
            everyone from casual users to power professionals.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center space-x-3">
            <span
              className={`text-sm ${!isYearly ? "font-medium text-blue-400" : "text-zinc-400"}`}
            >
              Monthly
            </span>
            <div className="relative">
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative h-7 w-14 rounded-full bg-zinc-700 transition-colors duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                <span
                  className={`absolute top-1 left-1 h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isYearly ? "translate-x-7" : ""}`}
                />
              </button>
              {isYearly && (
                <span className="absolute left-full ml-2 flex items-center text-xs font-medium text-green-400">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Save 25%
                </span>
              )}
            </div>
            <span
              className={`text-sm ${isYearly ? "font-medium text-blue-400" : "text-zinc-400"}`}
            >
              Yearly
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {/* Free Plan */}
          <div
            className={`borderborder-zinc-800 flex flex-col justify-between rounded-xl bg-zinc-900 p-6 transition-all duration-300 lg:p-8 ${
              hoveredFree
                ? "translate-y-[-4px] transform shadow-lg shadow-blue-500/5"
                : "shadow-md shadow-zinc-900/50"
            }`}
            onMouseEnter={() => setHoveredFree(true)}
            onMouseLeave={() => setHoveredFree(false)}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium">Hypermail Basic</h2>
                  <span className="ml-2 rounded-full bg-blue-900 px-2 py-0.5 text-xs font-medium text-blue-200">
                    Free
                  </span>
                </div>
                <span className="block text-3xl font-semibold">$0</span>
                <p className="text-sm text-zinc-400">Forever free plan</p>
              </div>

              <Button
                asChild
                variant="outline"
                className={`w-full transition-colors duration-300 ${
                  hoveredFree ? "border-blue-600 text-blue-400" : ""
                }`}
              >
                <Link href="">Get Started</Link>
              </Button>

              <div className="my-6 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Includes:</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Smart email categorization",
                    "5GB storage space",
                    "Basic AI assistant features",
                    "Email templates (3)",
                    "Mobile app access",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-zinc-300"
                    >
                      <Check className="size-4 text-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border-2 p-6 transition-all duration-300 lg:p-8 border-blue-600 bg-zinc-900 ${
              hoveredPro
                ? "translate-y-[-4px] transform shadow-xl shadow-blue-500/10"
                : "shadow-lg shadow-blue-500/5"
            }`}
            onMouseEnter={() => setHoveredPro(true)}
            onMouseLeave={() => setHoveredPro(false)}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
              RECOMMENDED
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium">Hypermail Pro</h2>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-semibold">${proPrice}</span>
                  <span className="ml-1 text-sm text-zinc-400">
                    /{isYearly ? "year" : "month"}
                  </span>
                  {isYearly && (
                    <span className="ml-2 text-xs font-medium text-green-400">
                      {proSaving}
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400">
                  Per user
                </p>
              </div>

              <Button
                asChild
                className="w-full bg-blue-600 transition-colors duration-300 hover:bg-blue-700"
              >
                <Link href="">Upgrade Now</Link>
              </Button>

              <div className="my-6 h-px bg-gradient-to-r from-transparent to-transparent via-zinc-700" />

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    Everything in Basic, plus:
                  </h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      "Advanced AI email composition",
                      "Unlimited storage space",
                      "Auto email categorization",
                      "Priority inbox features",
                      "Email templates (unlimited)",
                      "Custom email signatures",
                      "Advanced security features",
                      "Email scheduling",
                      "Premium support",
                      "Multi-account management",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2text-zinc-300"
                      >
                        <Check className="size-4 text-blue-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-zinc-400">
          Need a custom enterprise solution?{" "}
          <Link
            href=""
            className=" hover:underline text-blue-400"
          >
            Contact our sales team
          </Link>
        </div>
      </div>
    </section>
  );
}