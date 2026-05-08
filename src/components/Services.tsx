import { motion } from "framer-motion";
import { Palette, Megaphone, Camera, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Palette,
    title: "Branding & Identity",
    desc: "Developing cohesive visual ecosystems that build authority and lasting recognition.",
    items: ["Brand Strategy", "Visual Identity", "Design Guidelines"],
    color: "from-blue-500/20 to-indigo-500/10",
    accent: "text-blue-600",
    bgIcon: "bg-blue-500/10",
    span: "col-span-12 md:col-span-7",
  },
  {
    icon: Megaphone,
    title: "Strategic Social",
    desc: "Content systems engineered for viral potential and sustainable community growth.",
    items: ["Content Creation", "Growth Hacks", "Analytics"],
    color: "from-purple-500/20 to-pink-500/10",
    accent: "text-purple-600",
    bgIcon: "bg-purple-500/10",
    span: "col-span-12 md:col-span-5",
  },
  {
    icon: Camera,
    title: "Premium Content",
    desc: "Cinematic photography and videography designed to capture product essence.",
    items: ["Product Shots", "Director's Cut", "Motion Ads"],
    color: "from-orange-500/20 to-red-500/10",
    accent: "text-orange-600",
    bgIcon: "bg-orange-500/10",
    span: "col-span-12 md:col-span-5",
  },
  {
    icon: Sparkles,
    title: "Experiential Campaigns",
    desc: "Hybrid brand activations that bridge the gap between digital and physical realms.",
    items: ["Event Direction", "Viral Concepts", "Influencer Kits"],
    color: "from-emerald-500/20 to-teal-500/10",
    accent: "text-emerald-600",
    bgIcon: "bg-emerald-500/10",
    span: "col-span-12 md:col-span-7",
  },
];

export const Services = () => {
  return (
    <section id="services" className="pt-0 pb-8 space-y-16">
      {/* Header Section */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="h-px w-12 bg-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">Expertise & Solutions</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-special-serif text-5xl md:text-7xl leading-tight tracking-tight text-slate-900"
        >
          Four crafts. <span className="text-primary italic">One vision.</span>
        </motion.h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6 pb-20">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.65, 0, 0.35, 1] }}
            className={cn(
              "group relative rounded-[2.5rem] p-8 md:p-10 overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-2xl transition-all duration-700",
              s.span
            )}
          >
            {/* Background Color Accent */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10", s.color)} />
            
            <div className="relative h-full flex flex-col justify-between space-y-12">
              <div className="flex justify-between items-start">
                <div className={cn("p-5 rounded-3xl transition-all duration-500 shadow-sm group-hover:scale-110", s.bgIcon)}>
                  <s.icon className={cn("size-8", s.accent)} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-sm font-black text-slate-300 group-hover:text-primary/40 transition-colors uppercase tracking-widest">0{i + 1}</span>
                   <motion.div 
                     whileHover={{ rotate: 45, scale: 1.2 }}
                     className="size-10 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all mt-4 cursor-pointer"
                   >
                     <ArrowRight className="size-4 text-slate-900" />
                   </motion.div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-special-serif text-3xl md:text-4xl text-slate-900 leading-none">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm md:text-base max-w-sm">
                  {s.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-3">
                {s.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 group/item">
                    <CheckCircle2 className={cn("size-3.5 opacity-40 group-hover/item:opacity-100 transition-opacity", s.accent)} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover/item:text-slate-900 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Corner Accent Shape */}
            <div className="absolute -bottom-6 -right-6 size-24 bg-gradient-to-br from-primary/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* Trust Quote / Footer of Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative py-16 px-10 rounded-[3rem] bg-slate-900 text-white overflow-hidden text-center space-y-8"
      >
        <Sparkles className="size-12 text-primary mx-auto opacity-50" />
        <h3 className="font-special-serif text-3xl md:text-5xl max-w-3xl mx-auto leading-tight italic">
          "Expertise is the foundation, but <span className="text-primary italic">creative empathy</span> is what actually moves the needle."
        </h3>
        <div className="flex flex-col items-center gap-2">
           <div className="h-px w-20 bg-white/20" />
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Portfolio Methodology 2026</p>
        </div>

        {/* Abstract Background for Quote */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        <div className="absolute -bottom-24 -left-24 size-64 bg-primary/20 rounded-full blur-[100px] opacity-30" />
      </motion.div>
    </section>
  );
};
