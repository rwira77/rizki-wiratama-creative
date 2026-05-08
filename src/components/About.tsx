import { motion } from "framer-motion";
import portrait from "@/assets/rizki-portrait.png";
import { BadgeCheck, MapPin, Sparkles, Zap, Laptop, Brain, MessageSquare, ArrowUpRight, Trophy, Coffee, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { value: "+340%", label: "Growth", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
  { value: "12M+", label: "Reach", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50" },
  { value: "5+ yrs", label: "Exp.", icon: Laptop, color: "text-purple-500", bg: "bg-purple-50" },
];

const tags = ["Branding", "Creative Strategy", "Content Production", "Social Growth", "UI Interaction"];

export const About = () => {
  return (
    <section id="about" className="pt-8 pb-12 space-y-16">
      {/* Top Profile Header */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left: Profile "Card" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full lg:w-[40%] relative shrink-0"
        >
          <div className="relative group perspective-1000">
            {/* Multi-layered decorative backgrounds */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
            
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-200 shadow-2xl transition-all duration-500 border-4 border-white aspect-[3/4]">
              <img
                src={portrait}
                alt="Rizki Wiratama"
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-20" />
            </div>

            {/* MapPin / Location - Moved OUTSIDE overflow-hidden */}
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 flex items-center gap-2 px-3 py-1.5 bg-white backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 z-30"
            >
              <div className="size-6 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                <MapPin className="size-3.5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 pr-1">Jakarta, ID</span>
            </motion.div>

            {/* Persona Tag - Moved OUTSIDE overflow-hidden */}
            <div className="absolute -bottom-6 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl z-40 transform transition-transform group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="pl-2">
                  <h3 className="font-special-serif text-xl text-white leading-tight">Rizki Wiratama</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="size-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/50">Available for lead</p>
                  </div>
                </div>
                <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-white hover:rotate-12 transition-all cursor-pointer">
                  <ArrowUpRight className="size-5" />
                </div>
              </div>
            </div>

            {/* Floating Badges - Trophy */}
            <motion.div 
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 -right-12 bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 z-30"
            >
               <div className="size-8 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                 <Trophy className="size-4" />
               </div>
               <div className="pr-1">
                 <p className="text-[9px] font-bold uppercase text-slate-400 leading-none">Top Rated</p>
                 <p className="text-[11px] font-black text-slate-900 mt-0.5">Specialist</p>
               </div>
            </motion.div>

            {/* Floating Badges - Verified */}
            <motion.div 
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -left-12 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/50 flex flex-col items-center gap-2 z-30"
            >
              <div className="size-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <BadgeCheck className="size-5" />
              </div>
              <span className="[writing-mode:vertical-lr] text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 py-1">Verified</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Intro Info */}
        <div className="flex-1 space-y-10">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/5 px-3 py-1 rounded-md">Creative Dossier V.2</span>
              <div className="flex-1 h-px bg-slate-200" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-special-serif text-4xl md:text-5xl lg:text-7xl leading-[1.1] tracking-tight text-slate-900"
            >
              Pushing boundaries of <span className="text-primary italic">visual narrative</span> and <span className="font-sans font-black italic relative">
                strategy
                <svg className="absolute -bottom-1 left-0 w-full h-2 text-primary/10" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0,7 Q50,0 100,7" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="font-display text-xl leading-relaxed text-slate-600 font-light max-w-2xl">
              "I don't just design interfaces; I build communication systems that help brands win market share through clarity and emotion."
            </p>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="text-[9px] font-bold uppercase tracking-widest px-4 py-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-primary hover:text-white transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Mini Stats Widgets */}
          <div className="flex gap-4 md:gap-8 pt-4">
             {stats.map((s, i) => (
               <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-default"
               >
                 <div className="flex items-center gap-3">
                   <s.icon className={cn("size-4 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all", s.color)} />
                   <div className="space-y-0.5">
                     <div className="text-2xl font-black leading-none tracking-tighter text-slate-900">{s.value}</div>
                     <div className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">{s.label}</div>
                   </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </div>

      {/* Skills Showcase */}
      <div className="grid md:grid-cols-3 gap-6 pt-8">
        {[
          { 
            title: "Strategy", 
            icon: Brain, 
            desc: "Developing core brand identities that align with business objectives.",
            color: "blue"
          },
          { 
            title: "Creative", 
            icon: Sparkles, 
            desc: "High-fidelity visual design and cinematic brand storytelling.",
            color: "orange"
          },
          { 
            title: "Growth", 
            icon: MessageSquare, 
            desc: "Campaigns that convert followers into high-ticket customers.",
            color: "purple"
          }
        ].map((skill) => (
          <motion.div 
            key={skill.title}
            whileHover={{ y: -5 }}
            className="p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white shadow-sm hover:shadow-xl transition-all group"
          >
            <skill.icon className={cn("size-6 mb-4 transition-colors", `text-${skill.color}-500 opacity-60 group-hover:opacity-100`)} />
            <h4 className="font-special-serif text-xl mb-2 text-slate-900">{skill.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{skill.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer / Signature Area */}
      <div className="pt-20 flex flex-col items-center text-center space-y-6">
        <div className="h-px w-24 bg-slate-200" />
        <div className="relative">
          {/* Faux Signature using a font-serif with tilt */}
          <p className="font-special-serif text-3xl md:text-5xl -rotate-3 text-slate-400/30 select-none pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 w-full whitespace-nowrap">
            Rizki Wiratama
          </p>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 relative z-10">
            Crafting Digital Legacy
          </p>
        </div>
        
        <div className="flex gap-4">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="size-1 rounded-full bg-slate-300" />
           ))}
        </div>
      </div>
    </section>
  );
};
