import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Share2, 
  Camera, 
  Video, 
  Layout, 
  ChevronRight, 
  ChevronLeft,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const workBranding = "https://images.unsplash.com/photo-1541462608141-ad4d60da3e8a?q=80&w=2670&auto=format&fit=crop";
const workEvent = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop";
const workSocial = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop";
const workCampaign = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop";

export const initialWorks = [
  { id: "remlint-identity", title: "Remlint Visual Identity", cat: "Branding", img: workBranding, problem: "Outdated legacy perception", year: "2024", hasDetail: true },
  { id: "soiree-activation", title: "Soirée Activation", cat: "Branding", img: workEvent, problem: "Unmemorable launch event", year: "2024", hasDetail: false }
];

export const categories = [
  { id: "Branding", label: "Branding", icon: Palette, color: "from-blue-500 to-indigo-600", images: [workBranding, workEvent] },
  { id: "Social Media", label: "Social Media", icon: Share2, color: "from-purple-500 to-pink-600", images: [workSocial, workCampaign] },
  { id: "Photography", label: "Photography", icon: Camera, color: "from-orange-500 to-red-600", images: [workCampaign, workBranding] },
  { id: "Videography", label: "Videography", icon: Video, color: "from-emerald-500 to-teal-600", images: [workEvent, workSocial] },
  { id: "Graphic Design", label: "Graphic Design", icon: Layout, color: "from-slate-700 to-slate-900", images: [workBranding, workSocial] }
];

export const Portfolio = () => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [works, setWorks] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const { data, error } = await supabase.from('works').select('*').order('year', { ascending: false });
        if (error) throw error;
        setWorks(data && data.length > 0 ? data : initialWorks);
      } catch (error) {
        setWorks(initialWorks);
      }
    };
    fetchWorks();
  }, []);
  
  const filteredWorks = selectedCat 
    ? works.filter((w) => w.cat?.trim().toLowerCase() === selectedCat.toLowerCase())
    : works;

  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (a.hasDetail && !b.hasDetail) return -1;
    if (!a.hasDetail && b.hasDetail) return 1;
    return 0;
  });

  return (
    <section id="work" className="py-24 bg-transparent min-h-screen">
      <div className="max-w-[1200px] px-4 md:px-8 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div key="folders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-12 md:mb-20 max-w-2xl px-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-primary" /> Gallery
                </p>
                <h2 className="font-display text-3xl md:text-6xl font-light leading-tight tracking-tight text-slate-900">
                   Organized by <em className="text-primary italic">discipline</em>.
                </h2>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-2 md:gap-x-12 gap-y-16 md:gap-y-24 justify-items-center">
                {categories.map((cat) => {
                  const catProjects = works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase());
                  const previewImages = catProjects.length > 0 ? catProjects.slice(0, 2).map(p => p.img) : (cat as any).images;
                  
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCat(cat.id)}
                      className="group cursor-pointer flex flex-col items-center w-20 md:w-44"
                    >
                      <div className="relative w-full h-20 md:h-36 mb-4 md:mb-6 transition-all duration-500">
                        <div className={cn("absolute top-0 left-0 w-2/3 h-4 rounded-t-xl bg-gradient-to-br opacity-90", cat.color)} />
                        <div className="absolute inset-0 z-0">
                          {previewImages.map((img: string, idx: number) => (
                            <motion.div
                              key={idx}
                              variants={{ hover: { y: -40 - (idx * 20), rotate: idx % 2 === 0 ? -10 : 10, x: idx % 2 === 0 ? -12 : 12, transition: { type: "spring", stiffness: 200, damping: 15 } } }}
                              className={cn("absolute left-1 right-1 md:left-4 md:right-4 h-16 md:h-32 rounded-md md:rounded-lg border-[1px] md:border-2 border-white shadow-xl overflow-hidden z-[5]", idx === 0 ? "top-1 md:top-2 rotate-[-2deg]" : "top-2 md:top-4 rotate-[3deg]")}
                            >
                              <img src={img || workBranding} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt="" />
                            </motion.div>
                          ))}
                        </div>
                        <div className={cn("absolute bottom-0 left-0 right-0 h-16 md:h-32 rounded-xl md:rounded-2xl bg-gradient-to-br shadow-2xl z-10 p-2 md:p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:rotate-1 group-hover:translate-x-1", cat.color)}>
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] group-hover:opacity-0 transition-opacity" />
                          <div className="relative z-20 flex justify-between items-start">
                            <cat.icon className="size-4 md:size-8 text-white/50 group-hover:text-white transition-colors" />
                            <span className="text-[6px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest text-right leading-none">
                              {catProjects.length}<br/>Items
                            </span>
                          </div>
                          <div className="relative z-20">
                            <div className="h-0.5 md:h-1 w-4 md:w-8 bg-white/40 rounded-full mb-1 md:mb-2" />
                            <div className="h-0.5 md:h-1 w-6 md:w-12 bg-white/20 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <h3 className="font-display text-[10px] md:text-xl text-black/80 font-medium group-hover:text-primary transition-colors text-center">{cat.label}</h3>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-12 mb-8 px-4">
                <button onClick={() => setSelectedCat(null)} className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-black transition-colors uppercase tracking-[0.2em]">
                   <ChevronLeft className="size-4" /> Back
                </button>
                <h2 className="font-display text-4xl font-light text-slate-800 tracking-tight">{selectedCat}</h2>
              </div>

              {/* ULTRA PINTEREST MASONRY (Based on image ratio) */}
              <div className="columns-1 md:columns-2 gap-4 space-y-4 pb-48">
                {sortedWorks.map((w, i) => (
                  <motion.div 
                    key={w.id || i} 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="break-inside-avoid relative group cursor-pointer"
                  >
                    <div className="block overflow-hidden rounded-[3.5rem] bg-slate-50 border border-slate-50 shadow-lg hover:shadow-2xl transition-all duration-700">
                      <div className="relative w-full h-auto">
                        <img
                          src={w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                          alt={w.title}
                          className="w-full h-auto object-contain transition-transform duration-[2s] group-hover:scale-105"
                        />
                        
                        {/* Elegant Minimal Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
                          <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Portfolio</p>
                            <h3 className="font-special-serif text-3xl text-white mb-6 leading-tight">{w.title}</h3>
                            
                            <div className="flex justify-between items-center">
                               {w.hasDetail ? (
                                 <Link to={`/portfolio/${w.id}`} className="flex items-center gap-3">
                                    <div className="size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                       <Plus className="size-6" />
                                    </div>
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Case Study</span>
                                 </Link>
                               ) : (
                                 <a href="#contact" className="flex items-center gap-3">
                                    <div className="size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center">
                                       <ArrowUpRight className="size-6" />
                                    </div>
                                    <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Inquire</span>
                                 </a>
                               )}
                            </div>
                          </div>
                        </div>

                        {/* Minimal floating icon (Not Hovered) */}
                        {w.hasDetail && (
                          <div className="absolute top-10 right-10 z-20 size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-2xl group-hover:scale-0 transition-transform">
                             <ArrowUpRight className="size-6 rotate-[-45deg] group-hover:rotate-0 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
