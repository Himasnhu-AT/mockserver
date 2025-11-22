"use client";

import { motion } from "framer-motion";
import {
  Zap,
  ShieldAlert,
  Layout,
  Check,
  ArrowRight,
  Database,
  FileJson,
  Code,
} from "lucide-react";
import { Navbar } from "@/component/NavBar";
import { CodeBlock } from "@/component/CodeBlock";
import { FeatureCard } from "@/component/FeatureCard";
import { ChaosSimulator } from "@/component/chaosSimulator";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />
      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[800px] bg-linear-to-b from-white to-[#F5F5F7] rounded-b-[50%] -z-10 shadow-sm" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center z-10 ">
          <div className="inline-flex text-x items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-slate-600  font-semibold mb-8 hover:border-blue-200 hover:text-blue-600 transition-colors cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            v1.0 live
          </div>
          {/*<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-slate-600 text-xs font-semibold mb-8 hover:border-blue-200 hover:text-blue-600 transition-colors cursor-default"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            v0.1-beta live
          </motion.div>*/}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl lg:text-8xl font-bold tracking-tight mb-8 text-slate-900"
          >
            Frontend ready.
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Backend optional.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Generate realistic mock data, simulate network chaos, and build
            robust UIs with a single CLI command.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
          >
            <button className="group px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
              Get Started{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <CodeBlock command="npx cli-mockserver start" />
          </motion.div>

          {/* Hero Terminal Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-linear-to-t from-blue-600/20 to-transparent blur-3xl -z-10" />
            <div className="bg-[#1D1D1F] rounded-2xl shadow-2xl border border-white/10 overflow-hidden text-left ring-1 ring-black/5">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#2D2D2F]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 text-center text-xs text-gray-500 font-mono font-medium">
                  terminal — node — 80x24
                </div>
              </div>
              <div className="p-8 font-mono text-sm leading-relaxed">
                <div className="flex gap-2 mb-4 opacity-50">
                  <span className="text-green-400">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-gray-300">
                    npx cli-mockserver start
                  </span>
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.2 },
                    },
                  }}
                  className="space-y-2 text-gray-300"
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="flex gap-2"
                  >
                    <span className="text-blue-500">ℹ</span> Schema loaded from{" "}
                    <span className="text-white underline decoration-gray-600 underline-offset-4">
                      schema.json
                    </span>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="flex gap-2"
                  >
                    <span className="text-green-500">✔</span> 2,500 records
                    generated in 12ms
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="flex gap-2"
                  >
                    <span className="text-yellow-500">⚠</span> Chaos Mode:{" "}
                    <span className="text-white bg-yellow-500/20 px-1 rounded text-xs py-0.5 ml-1">
                      ENABLED (15% Jitter)
                    </span>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="mt-6 pt-4 border-t border-white/10"
                  >
                    <div className="text-green-400 font-bold mb-1">
                      🚀 Server ready at http://localhost:9500
                    </div>
                    <div className="text-gray-500 pl-4 border-l-2 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
                      ➜ /docs (Swagger UI)
                    </div>
                    <div className="text-gray-500 pl-4 border-l-2 border-gray-700 hover:border-purple-500 transition-colors cursor-pointer mt-1">
                      ➜ /_system (Schema Builder)
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Designed for the <br />
                modern workflow.
              </h2>
              <p className="text-xl text-slate-500 font-light">
                Everything you need to mock the real world, minus the backend.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Layout}
              title="Visual Schema Builder"
              desc="Drag, drop, and configure your API structure visually. Changes hot-reload the server instantly."
              delay={0.1}
            />
            <FeatureCard
              icon={ShieldAlert}
              title="Chaos Engineering"
              desc="Simulate 500 errors, network timeouts, and random failures to ensure your UI fails gracefully."
              delay={0.2}
            />
            <FeatureCard
              icon={Database}
              title="Rich Data Types"
              desc="Smart generation for 20+ types: UUIDs, avatars, dates, addresses, and localized content."
              delay={0.3}
            />
            <FeatureCard
              icon={Zap}
              title="Latency Simulation"
              desc="Test loading states by adding realistic network delay (jitter) to your endpoints."
              delay={0.4}
            />
            <FeatureCard
              icon={FileJson}
              title="Auto Documentation"
              desc="Every endpoint gets an automatic Swagger-like documentation page to share with the team."
              delay={0.5}
            />
            <FeatureCard
              icon={Code}
              title="CORS & Headers"
              desc="Full control over CORS, custom headers, and auth tokens to match production environments."
              delay={0.6}
            />
          </div>
        </div>
      </section>
      {/* --- INTERACTIVE DEMO SECTION --- */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block p-3 bg-red-50 text-red-600 rounded-2xl mb-8">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
              Is your UI ready for <span className="text-red-500">Chaos?</span>
            </h2>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-light">
              Most bugs happen when the network is slow or the server errors
              out. Our Chaos Mode lets you define a{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-slate-700">
                globalErrorRate
              </code>{" "}
              or target specific endpoints to fail.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="mt-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Check size={16} strokeWidth={3} />
                </div>
                <div>
                  <strong className="block text-lg text-slate-900 mb-1">
                    Test Loading Skeletons
                  </strong>
                  <span className="text-slate-500">
                    Add 2000ms delay to verify your loading states.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="mt-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Check size={16} strokeWidth={3} />
                </div>
                <div>
                  <strong className="block text-lg text-slate-900 mb-1">
                    Verify Error Toasts
                  </strong>
                  <span className="text-slate-500">
                    Trigger 500 errors to ensure user feedback works.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-red-100/50 to-orange-100/50 rounded-full blur-3xl -z-10" />
            <ChaosSimulator />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
