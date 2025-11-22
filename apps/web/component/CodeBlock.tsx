import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";

export const CodeBlock = ({ command }: { command: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-700/50 rounded-xl p-1.5 pr-2 shadow-2xl transition-all hover:border-slate-600">
      <div className="pl-4 font-mono text-sm text-blue-300">
        <span className="text-slate-500 select-none">$</span> {command}
      </div>
      <button
        onClick={handleCopy}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={16} className="text-green-400" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Copy
                size={16}
                className="text-slate-400 group-hover:text-white"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
