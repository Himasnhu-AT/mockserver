"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Zap,
  Shield,
  Search,
  ChevronRight,
  Menu,
  Github,
  ArrowLeft,
} from "lucide-react";
import { CodeBlock } from "@/component/CodeBlock";

const DOCS_NAV = [
  {
    title: "Getting Started",
    items: ["Introduction", "Installation", "Quick Start"],
  },
  {
    title: "Core Concepts",
    items: ["Schema Definition", "Data Types", "Chaos Mode"],
  },
  {
    title: "Advanced",
    items: ["Authentication", "CORS & Headers", "Docker Support"],
  },
  {
    title: "Reference",
    items: ["CLI Commands", "Configuration API"],
  },
];

// --- Main Page Component ---

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("Introduction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Content Renderer
  const renderContent = () => {
    // Default Documentation Content (Mock)
    return (
      <motion.div
        key={activeSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl"
      >
        <div className="mb-8">
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-2 block">
            Documentation
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            {activeSection}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            MockCLI helps frontend developers generate realistic data and
            simulate backend failures without writing a single line of backend
            code.
          </p>
        </div>

        <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600">
          {activeSection === "Installation" && (
            <>
              <h3>Prerequisites</h3>
              <p>Ensure you have Node.js 18+ installed.</p>
              <CodeBlock command="npm install -g mock-chaos-cli" />
              <h3>Local Installation</h3>
              <p>If you prefer to install it per project:</p>
              <CodeBlock command="npm install --save-dev mock-chaos-cli" />
            </>
          )}

          {activeSection === "Introduction" && (
            <>
              <div className="grid grid-cols-2 gap-4 my-8 not-prose">
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <Zap className="text-blue-600 mb-3" />
                  <h4 className="font-bold text-slate-900">Instant API</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Zero config required to start serving JSON.
                  </p>
                </div>
                <div className="p-6 bg-red-50 rounded-xl border border-red-100">
                  <Shield className="text-red-600 mb-3" />
                  <h4 className="font-bold text-slate-900">Chaos Mode</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Test your error boundaries effectively.
                  </p>
                </div>
              </div>
              <h3>Why MockCLI?</h3>
              <p>
                Backend teams are often blocked or slow. MockCLI decouples your
                frontend development process entirely.
              </p>
            </>
          )}

          {activeSection === "Chaos Mode" && (
            <>
              <p>
                Chaos Mode allows you to simulate real-world infrastructure
                problems.
              </p>
              <CodeBlock
                command={`// schema.json
{
  "chaos": {
    "enabled": true,
    "globalErrorRate": 0.2, // 20% of requests will fail
    "scenarios": {
      "timeout": 3000 // Force 3s delay on failures
    }
  }
}`}
                // language="json"
              />
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col font-sans text-slate-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <Terminal size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight">MockServer</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-500">
              Docs v0.1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              size={16}
            />
            <input
              placeholder="Search documentation..."
              className="bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-full py-1.5 pl-9 pr-4 text-sm w-64 transition-all outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="text-[10px] font-mono bg-white border border-gray-200 rounded px-1.5 text-gray-400">
                ⌘K
              </span>
            </div>
          </div>
          <a
            href="#"
            className="text-gray-500 hover:text-slate-900 transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Sidebar Navigation */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#FBFBFD] border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] overflow-y-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <nav className="p-6 space-y-8">
            {DOCS_NAV.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          setActiveSection(item);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeSection === item
                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100"
                            : "text-slate-600 hover:bg-gray-100/80 hover:text-slate-900"
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-6 py-12 lg:px-12 bg-white lg:bg-transparent">
          {renderContent()}

          {/* Footer Navigation within Docs */}
          <div className="mt-20 pt-8 border-t border-gray-200 flex justify-between max-w-3xl">
            <button className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 group">
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Previous Section
            </button>
            <button className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 group">
              Next Section
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </main>

        {/* On-Page Table of Contents (Hidden on mobile) */}
        {/*<aside className="hidden xl:block w-64 p-8 sticky top-16 h-[calc(100vh-64px)]">
          <div className="text-xs font-bold text-slate-900 mb-4">
            ON THIS PAGE
          </div>
          <ul className="space-y-3 text-xs text-slate-500 border-l border-gray-200">
            <li className="pl-4 border-l-2 border-blue-600 text-blue-600 font-medium cursor-pointer">
              Overview
            </li>
            <li className="pl-4 hover:text-slate-900 hover:border-gray-300 border-l-2 border-transparent transition-all cursor-pointer">
              Prerequisites
            </li>
            <li className="pl-4 hover:text-slate-900 hover:border-gray-300 border-l-2 border-transparent transition-all cursor-pointer">
              Configuration
            </li>
            <li className="pl-4 hover:text-slate-900 hover:border-gray-300 border-l-2 border-transparent transition-all cursor-pointer">
              Examples
            </li>
          </ul>
        </aside>*/}
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
