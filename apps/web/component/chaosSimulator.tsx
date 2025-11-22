"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, AlertCircle } from "lucide-react";
import { useState } from "react";

export const ChaosSimulator = () => {
  const [chaosLevel, setChaosLevel] = useState(0);

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-slate-50/50 -z-10" />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity size={18} className="text-blue-600" />
            Chaos Simulator
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Drag slider to test UI resilience
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
            chaosLevel > 50
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {chaosLevel > 50 ? "UNSTABLE" : "STABLE"}
        </div>
      </div>

      {/* Mock UI Component */}
      <div className="relative h-48 bg-white rounded-2xl border border-gray-200 shadow-inner p-6 flex flex-col items-center justify-center mb-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {chaosLevel > 80 ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <AlertCircle size={40} className="text-red-500 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800">
                500 Server Error
              </div>
              <div className="text-xs text-slate-400">
                Connection Terminated
              </div>
            </motion.div>
          ) : (
            <motion.div
              animate={
                chaosLevel > 0
                  ? {
                      x: [0, -2, 2, -1, 1, 0],
                      opacity: 1 - chaosLevel / 200,
                    }
                  : {}
              }
              transition={{
                duration: 0.2,
                repeat: chaosLevel > 0 ? Infinity : 0,
                repeatDelay: (100 - chaosLevel) * 0.01,
              }}
              className="w-full space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-1/3 bg-slate-100 rounded animate-pulse" />
                  <div className="h-2 w-2/3 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-20 bg-slate-50 rounded-lg animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chaos Overlay */}
        {chaosLevel > 0 && (
          <motion.div
            className="absolute inset-0 bg-red-500/10 pointer-events-none"
            animate={{ opacity: chaosLevel / 100 }}
          />
        )}
      </div>

      {/* Control Slider */}
      <div className="relative pt-6">
        <input
          type="range"
          min="0"
          max="100"
          value={chaosLevel}
          onChange={(e) => setChaosLevel(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
          <span>0% (Safe)</span>
          <span>50% (Laggy)</span>
          <span>100% (Broken)</span>
        </div>
      </div>
    </div>
  );
};
