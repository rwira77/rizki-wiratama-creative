import { motion } from "framer-motion";
import { Briefcase, Calendar, Star, Zap, Cpu, MousePointer2, Layers, Figma, PenTool, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

const track = [
  {
    year: "2026",
    role: "Creative Marketing Manager",
    company: "DOFACE",
    description: "Driving commercial success through high-impact visual strategy and innovative lifecycle marketing management to dominate the skincare market.",
    stats: ["Visual Strategy", "Lifecycle Marketing"],
    isLatest: false
  },
  {
    year: "2024 — PRESENT",
    role: "Chief Business Officer",
    company: "SOBATRIP",
    description: "Orchestrating an end-to-end tourism ecosystem, ranging from travel agencies (Borneo Tour Center) and specialized documentation (Nemora Pictures) to a comprehensive digital travel platform.",
    stats: ["100+ TRIPS ORGANIZED", "3 SUBSIDIARY BRANDS", "+45% REVENUE GROWTH"],
    isLatest: true
  },
  {
    year: "2023 — PRESENT",
    role: "Chief Education Officer",
    company: "CERAH INDONESIA",
    description: "Leading a socio-educational platform and community dedicated to advancing political literacy, cultural awareness, and accessible learning through strategic digital programs.",
    stats: ["Socio-Education", "Political Literacy"],
    isLatest: true
  },
  {
    year: "2021 — 2026",
    role: "Creative Manager",
    company: "DONNA PRIVE",
    description: "Overseeing visual identity and brand communication strategies to expand market reach and cultivate customer loyalty within the modest fashion industry.",
    stats: ["+1M SOCIAL REACH", "20+ MAJOR CAMPAIGNS", "85% BRAND RETENTION"],
    isLatest: false
  },
  {
    year: "2019 — PRESENT",
    role: "Founder & Creative Director",
    company: "BECREATIVE AGENCY",
    description: "Leading the creative direction and digital marketing strategies to empower local businesses, helping them scale and strengthen their brand presence in the digital landscape.",
    stats: ["30+ BRANDS HANDLED", "+120% AVG. ROI", "12-PERSON TEAM LEAD"],
    isLatest: true
  },
  {
    year: "2018 — PRESENT",
    role: "Multidisciplinary Creative",
    company: "FREELANCE SOLUTIONS",
    description: "Delivering end-to-end digital solutions by merging visual design, photography, and programming to build functional and aesthetic products for diverse clients.",
    stats: ["+500 PROJECTS COMPLETED", "98% CLIENT SATISFACTION", "5+ CORE SKILLSETS"],
    isLatest: true
  },
];

const arsenal = [
  { name: "Illustrator", icon: "https://www.svgrepo.com/show/452147/adobe-illustrator.svg", category: "Design", bg: "bg-orange-50" },
  { name: "After Effects", icon: "https://www.svgrepo.com/show/452141/adobe-after-effects.svg", category: "Motion", bg: "bg-purple-50" },
  { name: "Lightroom", icon: "https://www.svgrepo.com/show/452145/adobe-lightroom.svg", category: "Photo", bg: "bg-blue-50" },
  { name: "Photoshop", icon: "https://www.svgrepo.com/show/452149/adobe-photoshop.svg", category: "Design", bg: "bg-blue-50" },
  { name: "Premiere", icon: "https://www.svgrepo.com/show/452150/adobe-premiere.svg", category: "Video", bg: "bg-purple-50" },
  { name: "Google Docs", icon: "https://www.svgrepo.com/show/380994/google-logo-docs-new.svg", category: "Writing", bg: "bg-blue-50" },
  { name: "VS Code", icon: "https://www.svgrepo.com/show/452129/vs-code.svg", category: "Code", bg: "bg-blue-50" },
  { name: "JavaScript", icon: "https://www.svgrepo.com/show/452045/js.svg", category: "Logic", bg: "bg-yellow-50" },
  { name: "React", icon: "https://www.svgrepo.com/show/452092/react.svg", category: "Frontend", bg: "bg-cyan-50" },
  { name: "Vite", icon: "https://www.svgrepo.com/show/374167/vite.svg", category: "Build", bg: "bg-purple-50" },
  { name: "Tailwind", icon: "https://www.svgrepo.com/show/374118/tailwind.svg", category: "Styles", bg: "bg-cyan-50" },
  { name: "Figma", icon: "https://www.svgrepo.com/show/452202/figma.svg", category: "UI/UX", bg: "bg-pink-50" },
  { name: "Notion", icon: "https://www.svgrepo.com/show/452076/notion.svg", category: "Productivity", bg: "bg-slate-50" },
  { name: "Hootsuite", icon: "https://www.svgrepo.com/show/343561/hootsuite-communication-chat-interaction-connection-conversation.svg", category: "Social", bg: "bg-amber-50" },
  { name: "Slack", icon: "https://www.svgrepo.com/show/452102/slack.svg", category: "Comm.", bg: "bg-white" },
  { name: "Meta", icon: "https://www.svgrepo.com/show/424909/meta-logo-facebook-2.svg", category: "Ad Strategy", bg: "bg-blue-50" },
  { name: "Data Studio", icon: "https://www.svgrepo.com/show/353809/google-data-studio.svg", category: "Data Viz", bg: "bg-white" },
  { name: "Antigravity", icon: "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/antigravity-color.png", category: "Agentic AI", bg: "bg-blue-50" },
  { name: "Claude AI", icon: "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/claude-color.png", category: "LLM", bg: "bg-orange-50" },
];

export const Experience = () => {
  return (
    <section id="experience" className="pt-0 pb-8 space-y-16 md:space-y-24">
      {/* Header Section */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="h-px w-12 bg-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">Professional Experiences</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-special-serif text-4xl md:text-7xl leading-tight tracking-tight text-slate-900"
        >
          Career <span className="text-primary italic">Journey</span>
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

      {/* Digital Ecosystem - Grid */}
      <div className="space-y-10 md:space-y-12 pt-12">
        <div className="flex items-center justify-between">
          <h3 className="font-special-serif text-3xl md:text-5xl text-slate-900">Digital Ecosystem</h3>
          <div className="h-px flex-1 mx-12 bg-slate-200 hidden md:block" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {arsenal.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group text-center space-y-4"
            >
              <div className={cn("size-12 md:size-14 mx-auto rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 p-2.5 shadow-sm", a.bg)}>
                <img src={a.icon} alt={a.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[9px] md:text-[10px] mb-0.5">{a.name}</h4>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{a.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
