import { motion } from "framer-motion";
import { Mail, MessageCircle, Instagram, Linkedin, ArrowUpRight, Globe, Clock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const channels = [
  { 
    icon: MessageCircle, 
    label: "WhatsApp", 
    value: "+62 812 3456 7890", 
    href: "https://wa.me/6281234567890",
    color: "from-emerald-500/20 to-green-500/5",
    accent: "text-emerald-600",
    span: "col-span-12 md:col-span-8"
  },
  { 
    icon: Mail, 
    label: "Direct Email", 
    value: "hello@rizkiwiratama.com", 
    href: "mailto:hello@rizkiwiratama.com",
    color: "from-blue-500/20 to-indigo-500/5",
    accent: "text-blue-600",
    span: "col-span-12 md:col-span-4"
  },
  { 
    icon: Instagram, 
    label: "Social / IG", 
    value: "@rizkiwiratama", 
    href: "https://instagram.com",
    color: "from-pink-500/20 to-orange-500/5",
    accent: "text-pink-600",
    span: "col-span-12 md:col-span-6"
  },
  { 
    icon: Linkedin, 
    label: "Professional / IN", 
    value: "Rizki Wiratama", 
    href: "https://linkedin.com",
    color: "from-sky-500/20 to-blue-500/5",
    accent: "text-sky-600",
    span: "col-span-12 md:col-span-6"
  },
];

export const Contact = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        timeZone: "Asia/Jakarta", 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="contact" className="py-8 space-y-12 md:space-y-16">
       {/* Header Section */}
       <div className="space-y-6 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="h-px w-12 bg-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">Collaboration</span>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="space-y-4"
        >
          <h2 className="font-special-serif text-4xl md:text-8xl leading-tight md:leading-[0.9] tracking-tight text-slate-900">
            Let's build <span className="text-primary italic underline decoration-primary/30 underline-offset-8 md:no-underline">extraordinary</span> together.
          </h2>
          <p className="text-slate-400 text-base md:text-xl font-light max-w-2xl leading-relaxed">
            Currently accepting select branding, content, and creative campaigns for 2026.
          </p>
        </motion.div>
      </div>

      {/* Global Context Indicator */}
      <div className="flex flex-wrap items-center gap-6 md:gap-8 py-6 border-y border-slate-100">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-slate-50 rounded-lg">
             <Globe className="size-4 text-slate-400" />
           </div>
           <div>
             <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">Location</p>
             <p className="text-xs md:text-sm font-bold text-slate-900 leading-none">Jakarta, ID</p>
           </div>
         </div>

         <div className="flex items-center gap-3">
           <div className="p-2 bg-slate-50 rounded-lg">
             <Clock className="size-4 text-slate-400 animate-pulse" />
           </div>
           <div>
             <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">Local Time</p>
             <p className="text-xs md:text-sm font-bold text-slate-900 leading-none">{time || "Jakarta"}</p>
           </div>
         </div>

         <div className="hidden md:flex items-center gap-2 ml-auto">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Available to start now</span>
         </div>
      </div>

      {/* Bento Grid Channels */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 pb-20">
        {channels.map((c, i) => (
          <motion.a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className={cn(
              "group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/60 bg-white/40 backdrop-blur-xl shadow-sm transition-all duration-500 hover:shadow-2xl hover:bg-white",
              c.span
            )}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10", c.color)} />
            
            <div className="relative flex flex-col justify-between h-full space-y-8 md:space-y-12">
               <div className="flex justify-between items-start">
                  <div className="p-3 md:p-4 bg-white shadow-sm rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    <c.icon className={cn("size-5 md:size-6", c.accent)} strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight className="size-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>

               <div>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{c.label}</p>
                 <h3 className="font-special-serif text-xl md:text-3xl text-slate-900 group-hover:text-primary transition-colors truncate">
                   {c.value}
                 </h3>
               </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Footer Sign-off (Mobile Optimized) */}
      <footer className="pt-20 pb-12 border-t border-slate-100 space-y-12 text-slate-900 mb-24 md:mb-0">
         <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
               <h4 className="font-special-serif text-4xl md:text-5xl text-slate-300 select-none opacity-40">Rizki Wiratama</h4>
               <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Creative Technologist · 2026</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 md:gap-x-12 gap-y-6">
               <div>
                  <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-4">Navigation</p>
                  <ul className="space-y-2 text-[12px] font-bold text-slate-500">
                     <li className="hover:text-primary transition-colors">Case Studies</li>
                     <li className="hover:text-primary transition-colors">Methodology</li>
                  </ul>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-4">Availability</p>
                   <ul className="space-y-2 text-[12px] font-bold text-slate-500">
                     <li>Q2 2026: Open</li>
                     <li>Q3 2026: Booking</li>
                  </ul>
               </div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-50 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 gap-6 text-center italic">
            <p>© 2026 Rizki Wiratama</p>
            <div className="flex items-center gap-6">
               <span className="hover:text-primary transition-colors">Privacy</span>
               <span className="hover:text-primary transition-colors">Legal</span>
            </div>
         </div>
      </footer>
    </section>
  );
};
