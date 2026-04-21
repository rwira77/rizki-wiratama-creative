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
  ExternalLink
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

  // Sorting Logic: Projects with hasDetail enabled go first
  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (a.hasDetail && !b.hasDetail) return -1;
    if (!a.hasDetail && b.hasDetail) return 1;
    return 0;
  });

  return (
    <section id="work" className="py-24 bg-transparent min-h-screen">
      <div className="container px-6 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div key="folders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-20 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-primary" /> Gallery
                </p>
                <h2 className="font-display text-5xl md:text-6xl font-light leading-tight tracking-tight text-slate-900">
                   Organized by <em className="text-primary italic">discipline</em>.
                </h2>
              </div>
              
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-8 gap-y-24 justify-items-center">
                {categories.map((cat) => {
                  const catProjects = works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase());
                  const previewImages = catProjects.length > 0 ? catProjects.slice(0, 2).map(p => p.img) : (cat as any).images;
                  
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCat(cat.id)}
                      className="group cursor-pointer flex flex-col items-center w-40"
                    >
                      <div className="relative w-full h-32 mb-4">
                        <div className={cn("absolute top-0 left-0 w-2/3 h-4 rounded-t-xl bg-gradient-to-br opacity-90", cat.color)} />
                        <div className="absolute inset-0 z-0">
                          {previewImages.map((img: string, idx: number) => (
                            <motion.div
                              key={idx}
                              variants={{ hover: { y: -30 - (idx * 15), rotate: idx % 2 === 0 ? -8 : 8, x: idx % 2 === 0 ? -10 : 10, transition: { type: "spring", stiffness: 300, damping: 20 } } }}
                              className={cn("absolute left-4 right-4 h-28 rounded-lg border-2 border-white shadow-xl overflow-hidden z-[5]", idx === 0 ? "top-2 rotate-[-2deg]" : "top-4 rotate-[3deg]")}
                            >
                              <img src={img || workBranding} className="w-full h-full object-cover" alt="" />
                            </motion.div>
                          ))}
                        </div>
                        <div className={cn("absolute bottom-0 left-0 right-0 h-28 rounded-2xl bg-gradient-to-br shadow-2xl z-10 p-5 flex flex-col justify-between overflow-hidden transition-all duration-500", cat.color)}>
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] group-hover:opacity-0 transition-opacity" />
                          <div className="relative z-20 flex justify-between items-start">
                            <cat.icon className="size-6 text-white/50 group-hover:text-white transition-colors" />
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest text-right leading-none">
                              {catProjects.length}<br/>Items
                            </span>
                          </div>
                          <div className="relative z-20">
                            <div className="h-0.5 w-6 bg-white/40 rounded-full mb-1" />
                            <div className="h-0.5 w-10 bg-white/20 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <h3 className="font-display text-base text-black/80 font-medium group-hover:text-primary transition-colors text-center">{cat.label}</h3>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="flex items-center justify-between mb-16 border-b border-slate-100 pb-12 px-4">
                <button onClick={() => setSelectedCat(null)} className="group flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-black transition-all">
                  <div className="size-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="size-4" />
                  </div>
                  Back to Folders
                </button>
                <div className="text-right">
                  <h2 className="font-display text-4xl font-light text-slate-900">{selectedCat}</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-2">{sortedWorks.length} Projects Detected</p>
                </div>
              </div>

              {/* Masonry Layout Container */}
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 px-4 pb-32">
                {sortedWorks.map((w, i) => (
                  <div key={w.id || i} className="break-inside-avoid">
                    <div className="relative group block rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100">
                      {/* Image Layer */}
                      <div className={cn(
                        "relative overflow-hidden w-full",
                        i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/5]" : "aspect-[1/1]"
                      )}>
                        <img
                          src={w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                          alt={w.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                        />
                        
                        {/* Detail Tag (If enabled) */}
                        {w.hasDetail && (
                          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                            <ExternalLink className="size-3" /> Case Study
                          </div>
                        )}
                        
                        {/* Index Number (Subtle) */}
                        <div className="absolute top-6 right-6 z-20 size-8 rounded-full border border-white/20 text-white/50 flex items-center justify-center text-[10px] font-black backdrop-blur-sm">
                          {String(i + 1).padStart(2, '0')}
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-2">{w.cat}</p>
                          <h3 className="font-special-serif text-3xl text-white mb-2 leading-tight">{w.title || "Untitled Project"}</h3>
                          <p className="text-white/60 text-xs line-clamp-2 max-w-[80%] font-medium mb-4">{w.problem || "Explore the story behind this creative execution."}</p>
                          
                          {w.hasDetail ? (
                            <Link to={`/portfolio/${w.id}`} className="inline-flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest group/btn">
                               View Story 
                               <div className="size-8 rounded-full bg-white text-black flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300 shadow-lg">
                                  <ArrowUpRight className="size-4" />
                               </div>
                            </Link>
                          ) : (
                            <a href="#contact" className="inline-flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest group/btn">
                               Inquire 
                               <div className="size-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300">
                                  <ArrowUpRight className="size-4" />
                               </div>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
