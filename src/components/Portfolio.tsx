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
      <div className="max-w-none w-full px-12 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div key="folders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-20 max-w-2xl px-4">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-primary" /> Gallery
                </p>
                <h2 className="font-display text-5xl md:text-6xl font-light leading-tight tracking-tight text-slate-900">
                   Organized by <em className="text-primary italic">discipline</em>.
                </h2>
              </div>
              
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-12 gap-y-24 justify-items-center">
                {categories.map((cat) => {
                  const catProjects = works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase());
                  const previewImages = catProjects.length > 0 ? catProjects.slice(0, 2).map(p => p.img) : (cat as any).images;
                  
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCat(cat.id)}
                      className="group cursor-pointer flex flex-col items-center w-44"
                    >
                      <div className="relative w-full h-36 mb-6 transition-all duration-500">
                        <div className={cn("absolute top-0 left-0 w-2/3 h-4 rounded-t-xl bg-gradient-to-br opacity-90", cat.color)} />
                        <div className="absolute inset-0 z-0">
                          {previewImages.map((img: string, idx: number) => (
                            <motion.div
                              key={idx}
                              variants={{ hover: { y: -40 - (idx * 20), rotate: idx % 2 === 0 ? -10 : 10, x: idx % 2 === 0 ? -12 : 12, transition: { type: "spring", stiffness: 200, damping: 15 } } }}
                              className={cn("absolute left-4 right-4 h-32 rounded-lg border-2 border-white shadow-xl overflow-hidden z-[5]", idx === 0 ? "top-2 rotate-[-2deg]" : "top-4 rotate-[3deg]")}
                            >
                              <img src={img || workBranding} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt="" />
                            </motion.div>
                          ))}
                        </div>
                        <div className={cn("absolute bottom-0 left-0 right-0 h-32 rounded-2xl bg-gradient-to-br shadow-2xl z-10 p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:rotate-1 group-hover:translate-x-1", cat.color)}>
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] group-hover:opacity-0 transition-opacity" />
                          <div className="relative z-20 flex justify-between items-start">
                            <cat.icon className="size-8 text-white/50 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-right leading-none">
                              {catProjects.length}<br/>Items
                            </span>
                          </div>
                          <div className="relative z-20">
                            <div className="h-1 w-8 bg-white/40 rounded-full mb-2" />
                            <div className="h-1 w-12 bg-white/20 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <h3 className="font-display text-xl text-black/80 font-medium group-hover:text-primary transition-colors text-center">{cat.label}</h3>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-16 border-b border-slate-100 pb-12 px-4 shadow-sm">
                <button onClick={() => setSelectedCat(null)} className="group flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-black transition-all uppercase tracking-widest">
                  <div className="size-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-colors shadow-sm">
                    <ChevronLeft className="size-4" />
                  </div>
                  Back
                </button>
                <div className="text-right">
                  <h2 className="font-display text-4xl font-light text-slate-900">{selectedCat}</h2>
                </div>
              </div>

              {/* TRUE PINTEREST MASONRY (Based on image ratio) */}
              <div className="columns-1 md:columns-2 gap-4 space-y-4 px-4 pb-48">
                {sortedWorks.map((w, i) => (
                  <motion.div 
                    key={w.id || i} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="break-inside-avoid relative group cursor-pointer"
                  >
                    <div className="block overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-700">
                      <div className="relative w-full h-auto">
                        <img
                          src={w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                          alt={w.title}
                          className="w-full h-auto object-contain transition-transform duration-[2s] group-hover:scale-105"
                        />
                        
                        {/* Pinterest Hover Reveal */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                          <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">{w.cat || "Portfolio"}</p>
                            <h3 className="font-special-serif text-3xl text-white mb-4 leading-tight">{w.title}</h3>
                            <p className="text-white/60 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">{w.problem || "Explore the creative journey of this project."}</p>
                            
                            <div className="flex items-center justify-between">
                               {w.hasDetail ? (
                                 <Link to={`/portfolio/${w.id}`} className="flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                                    Full Story
                                    <div className="size-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                                       <Plus className="size-6" />
                                    </div>
                                 </Link>
                               ) : (
                                 <a href="#contact" className="flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                                    Inquire Now
                                    <div className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center">
                                       <ArrowUpRight className="size-5" />
                                    </div>
                                 </a>
                               )}
                            </div>
                          </div>
                        </div>

                        {/* Minimal Arrow Tag for Detail Page */}
                        {w.hasDetail && (
                          <div className="absolute top-8 right-8 z-20 size-10 rounded-full bg-primary/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg group-hover:scale-0 transition-transform">
                             <ArrowUpRight className="size-5" />
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
