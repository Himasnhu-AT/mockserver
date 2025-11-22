import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export const FeatureCard = ({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group p-8 `rounded-4xl bg-white border border-gray-100 hover:border-blue-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-blue-600 flex items-center justify-center mb-6 transition-colors duration-300">
      <Icon
        size={24}
        className="text-slate-900 group-hover:text-white transition-colors duration-300"
      />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
  </motion.div>
);
