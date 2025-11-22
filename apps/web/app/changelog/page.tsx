"use client";
import { motion } from "framer-motion";
import { Badge, Calendar } from "lucide-react";

const CHANGELOG_DATA = [
  {
    version: "v2.0.0",
    date: "November 24, 2023",
    isMajor: true,
    changes: [
      {
        type: "new",
        text: "Introduced Chaos Mode for simulating network failures",
      },
      { type: "feature", text: "Visual Schema Builder UI (Beta)" },
      {
        type: "improvement",
        text: "Performance: 10x faster generation for large datasets",
      },
    ],
  },
  {
    version: "v1.5.2",
    date: "October 10, 2023",
    changes: [
      { type: "fix", text: "Fixed CORS issue when using credentials: true" },
      {
        type: "improvement",
        text: "Added 'avatar' and 'timezone' to field types",
      },
    ],
  },
  {
    version: "v1.5.0",
    date: "September 1, 2023",
    changes: [
      { type: "feature", text: "Added support for external schema.json files" },
      { type: "fix", text: "Resolved memory leak in long-running watch mode" },
    ],
  },
];

export default function changelog() {
  return (
    <div className="max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Changelog</h1>
        <p className="text-xl text-slate-500">
          Stay up to date with the latest features and improvements.
        </p>
      </motion.div>

      <div className="relative border-l border-gray-200 ml-3 space-y-12">
        {CHANGELOG_DATA.map((release, idx) => (
          <motion.div
            key={release.version}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-8"
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-white ${release.isMajor ? "bg-blue-600 w-3.5 h-3.5 -left-[7px]" : "bg-gray-300"}`}
            />

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {release.version}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={14} />
                {release.date}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <ul className="space-y-4">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <Badge type={change.type} />
                    </div>
                    <span className="text-slate-600 leading-relaxed text-sm">
                      {change.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
