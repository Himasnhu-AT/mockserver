import { motion } from "framer-motion";
import { ArrowUpRight, GithubIcon, Terminal } from "lucide-react";

export const Navbar = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50"
  >
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Terminal size={18} />
        </div>
        <span className="font-semibold text-lg tracking-tight text-slate-900">
          MockServer
        </span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
        <a href="changelog" className="hover:text-blue-600 transition-colors">
          Changelog
        </a>
        <a
          href="schemabuilder"
          className="hover:text-blue-600 transition-colors"
        >
          Dashboard
        </a>
        <a href="docs" className="hover:text-blue-600 transition-colors">
          Documentation
        </a>
        <a
          href="#how-it-works"
          className="hover:text-blue-600 transition-colors"
        >
          <span className="flex">
            {" "}
            Github <ArrowUpRight size={16} className="ml-2 mt-0.5" />
          </span>
        </a>
      </div>
    </div>
  </motion.nav>
);
