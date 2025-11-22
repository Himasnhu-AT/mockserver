import { Terminal } from "lucide-react";

export const Footer = () => (
  <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <Terminal size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">MockServer</span>
        </div>

        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition">
            GitHub
          </a>
          <a href="#" className="hover:text-slate-900 transition">
            NPM
          </a>
          <a href="#" className="hover:text-slate-900 transition">
            Twitter
          </a>
          <a href="#" className="hover:text-slate-900 transition">
            Docs
          </a>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} MockServer. TBH Open Source under
          (TBD LICENSE).
        </p>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>All Systems Operational</span>
        </div>
      </div>
    </div>
  </footer>
);
