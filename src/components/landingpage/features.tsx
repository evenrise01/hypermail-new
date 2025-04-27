"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Calendar, Search, Command, Sparkles, Zap, Clock, Plus, ArrowRight, Check, ChevronDown, Archive, Trash, MoreHorizontal, Star, Filter } from "lucide-react";
import Image from "next/image";

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const integrations = [
    { icon: "/google.svg", name: "Google" },
    { icon: "/gmail.svg", name: "Gmail" },
    { icon: "/google-calendar.svg", name: "Google Calendar" },
    { icon: "/outlook.svg", name: "Outlook" },
    { icon: "/microsoft.svg", name: "Microsoft" },
    { icon: "/microsoft-teams.svg", name: "Teams" },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mb-8 py-4 text-center">
        <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
          Built to cover <span className="bg-gradient-to-r from-purple-200 to-pink-400 bg-clip-text text-transparent"> your needs</span>
        </h2>
        <p className="mt-4">
          Libero sapiente aliquam quibusdam aspernatur, praesentium iusto
          repellendus.
        </p>
      </div>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/20 to-transparent dark:from-indigo-950/10 dark:to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-300/10 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-violet-300/10 blur-3xl"></div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto grid gap-6 sm:grid-cols-5">
          {/* Smart Inbox */}
          <Card
            className={`group overflow-hidden rounded-2xl border border-zinc-100 bg-white/50 backdrop-blur-lg transition-all duration-300 sm:col-span-3 dark:border-zinc-800 dark:bg-zinc-900/50 ${
              hoveredCard === "inbox"
                ? "scale-[1.01] shadow-lg dark:shadow-zinc-900/50"
                : "shadow-md"
            }`}
            onMouseEnter={() => setHoveredCard("inbox")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="md:p-8">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                  <Mail className="size-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium">AI-Powered Smart Inbox</h3>
              </div>
              <p className="max-w-md text-zinc-500 dark:text-zinc-400">
                Hypermail automatically categorizes and prioritizes your emails,
                surfacing what matters most while filtering out the noise.
              </p>
            </CardHeader>

{/* Card Content UI mockup*/}
<div className="w-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
      {/* Header with search */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search emails..."
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md"
          />
        </div>
        <button className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Filter className="size-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button 
          className={`flex-1 py-2 text-sm font-medium ${selectedTab === 'priority' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}
          onClick={() => setSelectedTab('priority')}
        >
          Priority
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium ${selectedTab === 'other' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}
          onClick={() => setSelectedTab('other')}
        >
          Other
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium ${selectedTab === 'sent' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`}
          onClick={() => setSelectedTab('sent')}
        >
          Sent
        </button>
      </div>
      
      {/* Email Categories */}
      <div className="p-4">
        {/* Urgent category */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Urgent (2)</h4>
            </div>
            <ChevronDown className="size-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          
          {/* Urgent emails */}
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">JD</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">John Doe</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">9:42 AM</span>
                  <Star className="size-3.5 text-amber-400" fill="#fbbf24" />
                </div>
              </div>
              <h5 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">Project proposal deadline today</h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">Hi team, Just a reminder that the project proposal is due by 5pm today. Please make sure to...</p>
            </div>
            
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-800 dark:text-blue-400">TS</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Tech Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">8:15 AM</span>
                </div>
              </div>
              <h5 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">RE: Server maintenance notification</h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">Your server will be down for scheduled maintenance in 30 minutes. Please save your work...</p>
            </div>
          </div>
        </div>
        
        {/* Important category */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Important (3)</h4>
            </div>
            <ChevronDown className="size-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          
          {/* Important emails */}
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-800 dark:text-purple-400">AM</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Alex Morgan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Yesterday</span>
                </div>
              </div>
              <h5 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">Q2 Marketing Strategy</h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">I've reviewed the Q2 marketing strategy and have some suggestions for improvements...</p>
            </div>
          </div>
        </div>
        
        {/* Other category collapsed */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500"></div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Other (12)</h4>
            </div>
            <ChevronDown className="size-4 text-zinc-500 dark:text-zinc-400" />
          </div>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <Archive className="size-4 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <Trash className="size-4 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <Clock className="size-4 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700">
            <MoreHorizontal className="size-4 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">AI-sorted</span>
          <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Check className="size-3 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
          </Card>

          {/* Calendar Integration */}
          <Card
            className={`group overflow-hidden rounded-2xl border border-zinc-100 bg-white/50 backdrop-blur-lg transition-all duration-300 sm:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/50 ${
              hoveredCard === "calendar"
                ? "scale-[1.01] shadow-lg dark:shadow-zinc-900/50"
                : "shadow-md"
            }`}
            onMouseEnter={() => setHoveredCard("calendar")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="md:p-8">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
                  <Calendar className="size-5 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg font-medium">Smart Scheduling</h3>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                Seamlessly integrate with your calendar to schedule meetings and
                manage events directly from your inbox.
              </p>
            </CardHeader>

            <CardContent className="mt-auto px-6 pb-6 md:px-8 md:pb-8">
              <div className="relative">
                <div className="absolute -inset-6 [background:radial-gradient(50%_75%_at_75%_50%,transparent,var(--color-background)_100%)]"></div>
                <div className="transform overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-1 transition-all duration-300 group-hover:translate-y-1 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-zinc-900">
                    {/* Tabs */}
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                      <button
                        className={`flex-1 py-2 text-sm font-medium ${selectedTab === "upcoming" ? "border-b-2 border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400" : "text-zinc-500 dark:text-zinc-400"}`}
                        onClick={() => setSelectedTab("upcoming")}
                      >
                        Upcoming
                      </button>
                      <button
                        className={`flex-1 py-2 text-sm font-medium ${selectedTab === "create" ? "border-b-2 border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400" : "text-zinc-500 dark:text-zinc-400"}`}
                        onClick={() => setSelectedTab("create")}
                      >
                        New Event
                      </button>
                    </div>

                    {/* Content */}
                    {selectedTab === "upcoming" ? (
                      <div className="p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Today, Apr 23
                          </h4>
                          <button className="text-xs font-medium text-violet-600 dark:text-violet-400">
                            View All
                          </button>
                        </div>

                        {/* Events list */}
                        <div className="space-y-3">
                          <div className="flex items-center rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                            <div className="mr-3 rounded-md bg-violet-100 p-2 dark:bg-violet-900/30">
                              <Clock className="size-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Weekly Planning
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                10:00 AM - 11:00 AM
                              </p>
                            </div>
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Now
                            </span>
                          </div>

                          <div className="flex items-center rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                            <div className="mr-3 rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                              <Calendar className="size-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Client Meeting
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                2:30 PM - 3:30 PM
                              </p>
                            </div>
                            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300">
                              2h
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              Tomorrow, Apr 24
                            </h4>
                          </div>

                          <div className="mt-3 flex items-center rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                            <div className="mr-3 rounded-md bg-amber-100 p-2 dark:bg-amber-900/30">
                              <Calendar className="size-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Product Review
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                9:00 AM - 10:30 AM
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="mb-4">
                          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Event Title
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                            placeholder="Add title"
                          />
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              Date
                            </label>
                            <input
                              type="date"
                              className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              Time
                            </label>
                            <input
                              type="time"
                              className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Calendar
                          </label>
                          <select className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
                            <option>Work</option>
                            <option>Personal</option>
                            <option>Family</option>
                          </select>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <button className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            <Plus className="mr-1 size-4" />
                            More Options
                          </button>
                          <button className="flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                            Schedule
                            <ArrowRight className="ml-1 size-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Connected accounts */}
                    <div className="mt-2 bg-zinc-50 p-4 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                            <Check className="size-3 text-white" />
                          </div>
                          <span className="text-xs text-zinc-600 dark:text-zinc-300">
                            Google Calendar connected
                          </span>
                        </div>
                        <button className="text-xs text-violet-600 dark:text-violet-400">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Command Bar */}
          <Card
            className={`group rounded-2xl border border-zinc-100 bg-white/50 p-8 backdrop-blur-lg transition-all duration-300 sm:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/50 ${
              hoveredCard === "command"
                ? "scale-[1.01] shadow-lg dark:shadow-zinc-900/50"
                : "shadow-md"
            }`}
            onMouseEnter={() => setHoveredCard("command")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Command className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium">Command Bar</h3>
            </div>
            <p className="mb-8 text-zinc-500 dark:text-zinc-400">
              Access all Hypermail features instantly with a powerful command
              bar. Navigate your inbox at the speed of thought.
            </p>

            <div className="mt-8 flex justify-center gap-6">
              <div
                className={`relative flex size-14 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${
                  hoveredCard === "command"
                    ? "-translate-y-1 transform shadow-md"
                    : ""
                }`}
              >
                <span className="absolute top-1 right-2 block text-xs text-zinc-400">
                  fn
                </span>
                <Command className="size-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div
                className={`relative flex size-14 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${
                  hoveredCard === "command"
                    ? "-translate-y-1 transform shadow-md"
                    : ""
                }`}
              >
                <span className="text-xl font-medium text-zinc-800 dark:text-zinc-200">
                  K
                </span>
              </div>
            </div>
          </Card>

          {/* Integrations */}
          <Card
            className={`group relative rounded-2xl border border-zinc-100 bg-white/50 backdrop-blur-lg transition-all duration-300 sm:col-span-3 dark:border-zinc-800 dark:bg-zinc-900/50 ${
              hoveredCard === "integrations"
                ? "scale-[1.01] shadow-lg dark:shadow-zinc-900/50"
                : "shadow-md"
            }`}
            onMouseEnter={() => setHoveredCard("integrations")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="md:p-8">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg bg-fuchsia-100 p-2 dark:bg-fuchsia-900/30">
                  <Sparkles className="size-5 text-fuchsia-600 dark:text-fuchsia-400" />
                </div>
                <h3 className="text-lg font-medium">Seamless Integrations</h3>
              </div>
              <p className="max-w-lg text-zinc-500 dark:text-zinc-400">
                Connect Hypermail with your favorite tools and services for a
                unified workflow experience.
              </p>
            </CardHeader>

            <CardContent className="px-6 pb-6 md:px-8 md:pb-8">
              <div className="grid grid-cols-3 gap-3 md:grid-cols-6 justify-between">
                {integrations.map((integration, index) => (
                  <div
                    key={index}
                    className={`flex aspect-square items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${
                      hoveredCard === "integrations"
                        ? "shadow-sm hover:-translate-y-1 hover:shadow-md"
                        : ""
                    }`}
                  >
                    <Image
                      className="size-8"
                      src={integration.icon}
                      alt={`${integration.name} logo`}
                      width="32"
                      height="32"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
