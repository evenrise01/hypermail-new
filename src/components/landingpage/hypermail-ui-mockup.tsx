'use client'
import { ArrowRight, ChevronRight, Mail, Sparkles, Zap, Shield, Search, User, Calendar} from "lucide-react";

export default function HypermailAppMockup() {
  
  return (
    <div className="bg-gray-950 text-white rounded-xl overflow-hidden border border-indigo-800/30 shadow-lg">
      {/* App header */}
      <div className="h-12 bg-gray-900 flex items-center px-4 border-b border-gray-800">
        <div className="flex space-x-2 mr-4">
          <div className="rounded-full h-3 w-3 bg-red-500"></div>
          <div className="rounded-full h-3 w-3 bg-yellow-500"></div>
          <div className="rounded-full h-3 w-3 bg-green-500"></div>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="text-indigo-400 size-5 mr-2" />
            <span className="text-white font-medium">Hypermail</span>
          </div>
          <div className="bg-indigo-900/40 rounded-full px-3 py-1 text-xs text-indigo-300 flex items-center">
            <Sparkles className="size-3 mr-1" /> AI-Powered
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-[80vh]">
        {/* Sidebar */}
        <div className="w-56 bg-gray-900 p-3 border-r border-gray-800">
          <div className="bg-indigo-600 text-white rounded-lg px-3 py-2 mb-6 flex items-center justify-between">
            <span className="font-medium">Compose</span>
            <Zap className="size-4" />
          </div>
          
          <div className="space-y-1">
            <div className="bg-indigo-900/50 rounded-md px-3 py-2 text-indigo-100 flex items-center justify-between">
              <span>Priority</span>
              <span className="bg-indigo-500 text-xs rounded-full px-2 py-0.5">3</span>
            </div>
            <div className="text-gray-400 rounded-md px-3 py-2 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <span>Inbox</span>
                <span className="bg-gray-700 text-xs rounded-full px-2 py-0.5">24</span>
              </div>
            </div>
            <div className="text-gray-400 rounded-md px-3 py-2 hover:bg-gray-800/50 transition-colors">Sent</div>
            <div className="text-gray-400 rounded-md px-3 py-2 hover:bg-gray-800/50 transition-colors">Drafts</div>
            <div className="text-gray-400 rounded-md px-3 py-2 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center">
                <Shield className="size-4 mr-2" />
                <span>Security</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-2 px-2">QUICK ACTIONS</div>
            <div className="space-y-1">
              <div className="text-gray-400 rounded-md px-3 py-2 hover:bg-gray-800/50 transition-colors flex items-center">
                <Search className="size-4 mr-2" />
                <span>Search all emails</span>
              </div>
              <div className="text-gray-400 rounded-md px-3 py-2 hover:bg-gray-800/50 transition-colors flex items-center">
                <User className="size-4 mr-2" />
                <span>Go to contacts</span>
              </div>
              <div className="text-gray-400 rounded-md px-3 py-2 hover:bg-gray-800/50 transition-colors flex items-center">
                <Calendar className="size-4 mr-2" />
                <span>Schedule sending</span>
              </div>
              <div className="text-gray-400 rounded-md px-3 py-2 hover:bg-gray-800/50 transition-colors flex items-center">
                <Sparkles className="size-4 mr-2" />
                <span>Generate AI response</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main email area */}
        <div className="flex-1 flex flex-col bg-gray-950">
          {/* Search bar */}
          <div className="bg-gray-900/70 p-3 border-b border-gray-800">
            <div className="bg-gray-800 rounded-lg w-full p-2 flex items-center">
              <input className="bg-transparent border-none flex-1 text-gray-300 text-sm outline-none placeholder:text-gray-500" placeholder="Search emails..." />
              <span className="text-indigo-400 text-xs">AI Search</span>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-auto">
            {/* AI Assistant notification */}
            <div className="p-3">
              <div className="bg-indigo-900/30 border border-indigo-800/30 rounded-lg p-3 flex items-center">
                <div className="bg-indigo-600/20 p-1.5 rounded-lg mr-3">
                  <Sparkles className="text-indigo-400 size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-indigo-300 font-medium">AI Assistant</div>
                  <div className="text-indigo-200/80 text-sm">I&apos;ve drafted 3 responses for your priority emails</div>
                </div>
                <button className="text-indigo-400 hover:text-indigo-300">
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
            
            {/* Priority inbox */}
            <div className="p-3">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-indigo-900/30 text-indigo-300 px-4 py-2.5 flex items-center justify-between font-medium">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Priority (3)
                  </div>
                  <ChevronRight className="size-5" />
                </div>
                <div className="divide-y divide-gray-800">
                  <div className="px-4 py-3 hover:bg-gray-800/30 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Alex Morgan</div>
                      <div className="text-gray-400 text-xs">10 min ago</div>
                    </div>
                    <div className="text-gray-400 text-sm">Urgent: Client Meeting Today</div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-800/30 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Sarah Li</div>
                      <div className="text-gray-400 text-xs">25 min ago</div>
                    </div>
                    <div className="text-gray-400 text-sm">RE: Project Deadline Extension</div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-800/30 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Finance Team</div>
                      <div className="text-gray-400 text-xs">1 hour ago</div>
                    </div>
                    <div className="text-gray-400 text-sm">Budget Approval Required</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Important section */}
            <div className="p-3">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-blue-900/20 text-blue-300 px-4 py-2.5 flex items-center justify-between font-medium">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Important (5)
                  </div>
                  <ChevronRight className="size-5" />
                </div>
                <div className="p-2 text-center text-gray-500 text-sm">
                  Click to expand
                </div>
              </div>
            </div>
            
            {/* Can Wait section */}
            <div className="p-3">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-purple-900/20 text-purple-300 px-4 py-2.5 flex items-center justify-between font-medium">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    Can Wait (12)
                  </div>
                  <ChevronRight className="size-5" />
                </div>
                <div className="p-2 text-center text-gray-500 text-sm">
                  Click to expand
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Command bar */}
      <div className="bg-gray-900 px-4 py-2 border-t border-gray-800 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <span className="inline-flex items-center mr-3">
            <span className="bg-gray-800 px-1.5 rounded mr-1">↑↓</span>
            to navigate
          </span>
          <span className="inline-flex items-center">
            <span className="bg-gray-800 px-1.5 rounded mr-1">⏎</span>
            to select
          </span>
        </div>
        <div className="text-xs text-gray-500">
          <span className="inline-flex items-center">
            <span className="bg-gray-800 px-1.5 rounded mr-1">Esc</span>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}