"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Mail, MessageCircleQuestion, ArrowRight } from "lucide-react";

export default function HypermailFAQs() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const faqItems = [
    {
      id: "item-1",
      question: "How does Hypermail's AI improve my email experience?",
      answer:
        "Hypermail uses advanced AI to automatically categorize emails, prioritize your inbox, and draft responses based on your communication style. Our smart filtering reduces inbox clutter by up to 70%, while our composition assistant helps you write better emails in half the time.",
    },
    {
      id: "item-2",
      question: "Is my email data secure with Hypermail?",
      answer:
        "Absolutely. Hypermail employs end-to-end encryption and follows strict data privacy protocols. Your emails and personal information are never stored on our servers permanently, and our AI models are trained on anonymized data. We're compliant with GDPR, CCPA, and other global privacy regulations.",
    },
    {
      id: "item-3",
      question: "Can I integrate Hypermail with my existing email accounts?",
      answer:
        "Yes! Hypermail seamlessly integrates with Gmail, Outlook, Yahoo Mail, ProtonMail, and most IMAP/POP3 email providers. Our setup wizard makes connecting your accounts simple, usually taking less than 2 minutes per account.",
    },
    {
      id: "item-4",
      question: "What's the difference between Hypermail Basic and Pro plans?",
      answer:
        "Hypermail Basic includes smart email categorization, 5GB storage, and essential AI features for individual use. The Pro plan adds unlimited storage, advanced AI composition, email scheduling, multi-account management, and priority support. Pro subscribers also get early access to new features.",
    },
    {
      id: "item-5",
      question: "Does Hypermail work offline?",
      answer:
        "Yes. Hypermail caches your recent emails for offline access, and you can compose drafts while offline. Once you reconnect, Hypermail will automatically sync all changes and send any pending messages. Pro users can customize which emails are available offline.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900"></div>
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute bottom-0 -left-16 h-32 w-32 rounded-full bg-blue-600 blur-3xl"></div>
        <div className="absolute top-1/3 right-0 h-48 w-48 rounded-full bg-indigo-600 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-xl bg-blue-900/30 p-3">
              <MessageCircleQuestion className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <h2 className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-zinc-400">
            Everything you need to know about your new AI-powered email
            experience
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-blue-500/5"
          >
            {faqItems.map((item, index) => (
              <div
                className="group"
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <AccordionItem
                  value={item.id}
                  className={`border-none px-6 py-1 transition-colors duration-300 data-[state=open]:bg-blue-950/20 md:px-8 ${index === 0 ? "rounded-t-2xl" : ""} ${index === faqItems.length - 1 ? "rounded-b-2xl" : ""}`}
                >
                  <AccordionTrigger
                    className={`cursor-pointer py-6 text-base font-medium hover:no-underline ${hoveredItem === item.id ? "text-blue-400" : ""}`}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <p className="pb-6 text-zinc-300">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
                {index < faqItems.length - 1 && (
                  <hr className="mx-6 border-zinc-800 transition-opacity group-data-[state=open]:opacity-0 md:mx-8" />
                )}
              </div>
            ))}
          </Accordion>

          <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 rounded-xl bg-white/20 p-2">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">Still have questions?</h3>
                <p className="text-sm text-blue-100">
                  Our support team is just an email away
                </p>
              </div>
              <Link
                href="#"
                className="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-300 hover:bg-blue-50"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
