"use client";

/*
TEMPLATE PAGE,
will export it out and use it in UI lib im making. so yeah, lets see  :)
*/

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For tables, strikethrough, etc.
import rehypeRaw from "rehype-raw"; // To support HTML inside Markdown
import {
  Terminal,
  Search,
  ChevronRight,
  Menu,
  Github,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { CodeBlock } from "@/component/CodeBlock";
import clsx from "clsx";

export interface DocItem {
  topic: string;
  fileAddr: string; // Path to .md file in public folder (e.g., "/docs/intro.md")
}

export interface DocSection {
  title: string;
  items: DocItem[];
}

interface DocumentationPageProps {
  config: DocSection[];
  brandName?: string;
}

export default function DocumentationPage({
  config,
  brandName = "MockServer",
}: DocumentationPageProps) {
  // Flatten config to find next/prev easily
  const allItems = config.flatMap((c) => c.items);

  const [activeTopic, setActiveTopic] = useState<string>(
    config[0]?.items[0]?.topic || "",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Markdown State
  const [markdownContent, setMarkdownContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find active item details
  const currentItem = allItems.find((item) => item.topic === activeTopic);
  const currentIndex = allItems.findIndex((item) => item.topic === activeTopic);
  const prevItem = allItems[currentIndex - 1];
  const nextItem = allItems[currentIndex + 1];

  // Scroll to top on topic change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTopic]);

  // Fetch Markdown Content
  useEffect(() => {
    if (!currentItem) return;

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(currentItem.fileAddr);
        if (!response.ok) {
          throw new Error(`Failed to load ${currentItem.fileAddr}`);
        }
        const text = await response.text();
        setMarkdownContent(text);
      } catch (err) {
        console.error(err);
        setError("Failed to load documentation content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [currentItem]);

  // --- Renderers for Markdown ---
  const markdownComponents = {
    // Override standard code blocks with your custom CodeBlock
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      if (!inline && match) {
        return (
          <div className="my-6 not-prose">
            <CodeBlock
              command={codeString}
              // You might need to update CodeBlock to accept a 'language' prop
              // or just pass it as command if it detects language automatically
            />
          </div>
        );
      }

      // Inline code styling
      return (
        <code
          className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono text-sm before:content-[''] after:content-['']"
          {...props}
        >
          {children}
        </code>
      );
    },
    // Custom Table Styling
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-8 border border-gray-200 rounded-lg">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50 border-b border-gray-200 text-slate-900 font-bold">
        {children}
      </thead>
    ),
    th: ({ children }: any) => <th className="p-4">{children}</th>,
    td: ({ children }: any) => (
      <td className="p-4 border-b border-gray-100 last:border-0 text-slate-600">
        {children}
      </td>
    ),
    // Header adjustments
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold text-slate-900 mb-6">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-gray-100">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="text-slate-600 leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-outside ml-5 space-y-2 mb-6 text-slate-600">
        {children}
      </ul>
    ),
    li: ({ children }: any) => <li className="pl-1">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 pl-4 py-1 pr-4 my-6 text-slate-700 italic rounded-r">
        {children}
      </blockquote>
    ),
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col font-sans text-slate-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-slate-500"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg shadow-sm">
              <Terminal size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              {brandName}
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
              Docs
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
              placeholder="Search docs..."
              className="bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-lg py-1.5 pl-9 pr-12 text-sm w-64 transition-all outline-none placeholder:text-gray-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="text-[10px] font-mono bg-white border border-gray-200 rounded px-1.5 text-gray-400">
                /
              </span>
            </div>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
          <a
            href="#"
            className="text-gray-500 hover:text-slate-900 transition-colors hover:bg-gray-100 p-2 rounded-lg"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        {/* Sidebar Navigation */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#FBFBFD] border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] overflow-y-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <nav className="p-6 space-y-8">
            {config.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.topic}>
                      <button
                        onClick={() => {
                          setActiveTopic(item.topic);
                          setIsSidebarOpen(false);
                        }}
                        className={clsx(
                          "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between group",
                          activeTopic === item.topic
                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                            : "text-slate-600 hover:bg-gray-100/80 hover:text-slate-900",
                        )}
                      >
                        {item.topic}
                        {activeTopic === item.topic && (
                          <ChevronRight size={14} className="text-blue-500" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-6 py-12 lg:px-16 bg-white lg:bg-transparent overflow-y-auto h-[calc(100vh-64px)]">
          <motion.div
            key={activeTopic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl"
          >
            {/* Breadcrumb */}
            <div className="mb-8">
              <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-2 block">
                Docs /{" "}
                {
                  config.find((s) =>
                    s.items.some((i) => i.topic === activeTopic),
                  )?.title
                }
              </span>
            </div>

            {/* Content Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Loading documentation...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="mb-4" size={32} />
                <p>{error}</p>
                <p className="text-sm text-red-400 mt-2">
                  Check console for details.
                </p>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            )}
          </motion.div>

          {/* Footer Navigation */}
          {!isLoading && !error && (
            <div className="mt-20 pt-8 border-t border-gray-200 flex justify-between max-w-4xl">
              <button
                onClick={() => prevItem && setActiveTopic(prevItem.topic)}
                disabled={!prevItem}
                className={clsx(
                  "text-sm font-medium flex items-center gap-2 group transition-colors",
                  prevItem
                    ? "text-slate-500 hover:text-blue-600 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed",
                )}
              >
                <ArrowLeft
                  size={16}
                  className={clsx(
                    prevItem &&
                      "group-hover:-translate-x-1 transition-transform",
                  )}
                />
                {prevItem ? prevItem.topic : "Start"}
              </button>

              <button
                onClick={() => nextItem && setActiveTopic(nextItem.topic)}
                disabled={!nextItem}
                className={clsx(
                  "text-sm font-medium flex items-center gap-2 group transition-colors",
                  nextItem
                    ? "text-slate-500 hover:text-blue-600 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed",
                )}
              >
                {nextItem ? nextItem.topic : "End"}
                <ChevronRight
                  size={16}
                  className={clsx(
                    nextItem &&
                      "group-hover:translate-x-1 transition-transform",
                  )}
                />
              </button>
            </div>
          )}

          <footer className="mt-12 text-center text-slate-400 text-sm pb-8">
            <p>
              {brandName} CLI © {new Date().getFullYear()}. MIT License.
            </p>
          </footer>
        </main>
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
