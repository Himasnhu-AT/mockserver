"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Zap, Bug, Sparkles, TrendingUp, Tag } from "lucide-react";
import { Navbar } from "@/component/NavBar";
import Link from "next/link";

type ChangeType = "new" | "feature" | "improvement" | "fix";

interface ChangeItem {
  type: ChangeType | string;
  text: string;
}

interface Release {
  version: string;
  date: string;
  isMajor?: boolean;
  hash: string;
  changes: ChangeItem[];
}

const CHANGELOG_DATA: Release[] = [
  {
    version: "v1.3.0",
    date: "December 14, 2025",
    isMajor: false,
    hash: "v1.3.0", // Linking to Tag instead of commit hash
    changes: [
      {
        type: "new",
        text: "Release v1.3.0",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "November 22, 2025",
    isMajor: true,
    hash: "v1.0.0", // Linking to Tag instead of commit hash
    changes: [
      {
        type: "new",
        text: "Initial Public Release: A dynamic mock server with built-in Chaos Engineering.",
      },
      {
        type: "feature",
        text: "CLI Commands: Added 'init', 'start' (with --watch), 'validate', and 'generate' for static exports.",
      },
      {
        type: "feature",
        text: "Chaos Mode: Simulate network timeouts, server errors (500), and connectivity drops.",
      },
      {
        type: "feature",
        text: "Rich Data Types: Support for advanced field generation (e.g., 'array:image:0:5', 'date:recent', 'enum').",
      },
      {
        type: "feature",
        text: "Automatic Pagination: Built-in envelope formatting and meta data for array resources.",
      },
    ],
  },
];

const ChangeBadge = ({ type }: { type: string }) => {
  const styles: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode; label: string }
  > = {
    new: {
      bg: "bg-blue-100 border-blue-200",
      text: "text-blue-700",
      icon: <Sparkles size={12} />,
      label: "New",
    },
    feature: {
      bg: "bg-purple-100 border-purple-200",
      text: "text-purple-700",
      icon: <Zap size={12} />,
      label: "Feature",
    },
    improvement: {
      bg: "bg-green-100 border-green-200",
      text: "text-green-700",
      icon: <TrendingUp size={12} />,
      label: "Improved",
    },
    fix: {
      bg: "bg-orange-100 border-orange-200",
      text: "text-orange-700",
      icon: <Bug size={12} />,
      label: "Fix",
    },
  };

  const style = styles[type] || {
    bg: "bg-gray-100 border-gray-200",
    text: "text-gray-700",
    icon: <Tag size={12} />,
    label: type,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${style.bg} ${style.text}
      `}
    >
      {style.icon}
      {style.label}
    </span>
  );
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-6 lg:px-12 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <Navbar />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16 mt-12"
        >
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-2 block">
            Product Updates
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Changelog
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
            New updates and improvements to MockServer CLI.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative border-l border-gray-200 ml-3 md:ml-6 space-y-16">
          {CHANGELOG_DATA.map((release, idx) => (
            <motion.div
              key={release.version}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Node */}
              <div
                className={`
                  absolute -left-[5px] top-2.5 w-2.5 h-2.5 rounded-full border-2 border-white ring-1
                  ${release.isMajor ? "bg-blue-600 ring-blue-200 scale-125" : "bg-gray-300 ring-gray-100"}
                `}
              />

              {/* Version Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  {release.version}
                  {release.isMajor && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900 text-white tracking-wide">
                      Major Release
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                  <Calendar size={14} className="text-slate-400" />
                  <time>{release.date}</time>
                </div>
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <ul className="space-y-5">
                  {release.changes.map((change, i) => (
                    <li
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                    >
                      <div className="shrink-0 pt-0.5">
                        <ChangeBadge type={change.type as ChangeType} />
                      </div>
                      <span className="text-slate-600 leading-relaxed text-[15px]">
                        {change.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {/* Commit Hash / Footer (Mock) */}
                <Link
                  href={`https://github.com/himasnhu-at/mockserver/releases/tag/${release.hash}`}
                  target="_blank"
                  className="font-mono text-xs text-blue-500 hover:underline"
                >
                  {release.hash}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
