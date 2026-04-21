import { motion } from "framer-motion";
import { Briefcase, Calendar, Star, Zap, Cpu, MousePointer2, Layers, Figma, PenTool, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

const track = [
  {
    year: "2022 — 2024",
    role: "Marketing Manager",
    company: "Indie Fashion Label",
    description: "Driving commercial success through high-impact visual strategy and lifecycle marketing.",
    stats: ["+1,400% IG Growth", "+85% Sales YoY", "14 Campaigns"],
    isLatest: true
  },
  {
    year: "2020 — 2022",
    role: "Brand & Content Lead",
    company: "Creative Studio (Jakarta)",
    description: "Orchestrating brand ecosystems for tech founders and high-growth SMEs.",
    stats: ["12M organic imp.", "20+ brand systems"],
    isLatest: false
  },
  {
    year: "2019 — 2020",
    role: "Freelance Designer",
    company: "Independent",
    description: "High-end editorial design and photography for premium lifestyle brands.",
    stats: ["Signature Visual Style", "F&B Specialist"],
    isLatest: false
  },
];

const arsenal = [
  { name: "Figma", icon: Figma, level: "Master", color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Adobe Suite", icon: PenTool, level: "Expert", color: "text-red-500", bg: "bg-red-50" },
  { name: "Strategy", icon: Layers, level: "Senior", color: "text-blue-500", bg: "bg-blue-50" },
  { name: "UI Design", icon: Layout, level: "Master", color: "text-orange-500", bg: "bg-orange-50" },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-8 space-y-16 md:space-y-24">
      {/* Header Section */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="h-px w-12 bg-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">Professional Path</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-special-serif text-4xl md:text-7xl leading-tight tracking-tight text-slate-900"
        >
          Receipts, not <span className="text-primary italic">promises.</span>
        </motion.h2>
      </div>

      {/* Timeline Section */}
      <div className="relative space-y-12 pl-4 md:pl-0">
        {/* Vertical Line */}
        <div className="absolute left-[20px] md:left-[147px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-slate-200 to-slate-100" />

        {track.map((t, i) => (
          <motion.div
            key={t.role}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 relative items-start group"
          >
            {/* Year Column (Desktop) */}
            <div className="md:col-span-2 md:text-right pt-2 pr-12 hidden md:block">
               <span className="font-special-serif text-lg text-slate-400 group-hover:text-primary transition-colors duration-500">{t.year}</span>
            </div>

            {/* Indicator Dot */}
            <div className="absolute left-[13px] md:left-[140px] top-3 z-10">
               <div className={cn(
                 "size-[14px] md:size-[15px] rounded-full border-2 border-white shadow-md transition-all duration-500 group-hover:scale-150", 
                 t.isLatest ? "bg-primary animate-pulse" : "bg-slate-300 group-hover:bg-primary/60"
               )} />
            </div>

            {/* Content Column */}
            <div className="ml-8 md:ml-0 md:col-span-10 space-y-6 bg-white/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/60 shadow-sm group-hover:shadow-2xl group-hover:bg-white transition-all duration-700">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <div className="flex items-center gap-3 mb-2 md:mb-0">
                      {t.isLatest && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
                          <Zap className="size-3 text-primary fill-primary" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Current</span>
                        </div>
                      )}
                      <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-slate-400">{t.year}</span>
                   </div>
                   <h3 className="font-special-serif text-2xl md:text-4xl text-slate-900 group-hover:text-primary transition-colors">{t.role}</h3>
                   <div className="flex items-center gap-3 mt-1 text-slate-600 font-bold uppercase tracking-widest text-[10px] md:text-[11px]">
                     <span className="text-primary/70">{t.company}</span>
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
                    {t.stats.map((stat) => (
                      <span key={stat} className="px-3 md:px-4 py-1.5 bg-slate-900/5 backdrop-blur-md border border-slate-900/5 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-tight group-hover:translate-y-[-2px] transition-transform">
                        {stat}
                      </span>
                    ))}
                 </div>
               </div>

               <p className="text-slate-500 leading-relaxed max-w-2xl text-base md:text-lg font-light">
                 {t.description}
               </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Creative Arsenal - Bento Grid */}
      <div className="space-y-10 md:space-y-12 pt-12">
        <div className="flex items-center justify-between">
           <h3 className="font-special-serif text-3xl md:text-5xl text-slate-900">Creative Arsenal</h3>
           <div className="h-px flex-1 mx-12 bg-slate-200 hidden md:block" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           {arsenal.map((a, i) => (
             <motion.div
               key={a.name}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -5 }}
               className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group text-center space-y-4 md:space-y-6"
             >
                <div className={cn("size-12 md:size-16 mx-auto rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", a.bg)}>
                  <a.icon className={cn("size-6 md:size-8", a.color)} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] md:text-xs mb-1">{a.name}</h4>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{a.level}</p>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};
