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
  ArrowUpRight
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

  return (
    <section id="work" className="py-24 bg-transparent min-h-screen">
      <div className="container px-6 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div key="folders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-20 max-w-2xl px-4">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-primary" /> Gallery
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-light leading-tight tracking-tight text-slate-900">
                   Organized by <em className="text-primary italic">discipline</em>.
                </h2>
              </div>
              
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-8 gap-y-24 justify-items-center">
                {categories.map((cat) => {
                  const projects = works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase());
                  const previewImages = projects.length > 0 ? projects.slice(0, 2).map(p => p.img) : (cat as any).images;
                  
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCat(cat.id)}
                      className="group cursor-pointer flex flex-col items-center w-40"
                    >
                      <div className="relative w-full h-32 mb-4 transition-all duration-500">
                        <div className={cn("absolute top-0 left-0 w-2/3 h-4 rounded-t-xl bg-gradient-to-br opacity-90", cat.color)} />
                        <div className="absolute inset-0 z-0">
                          {previewImages.map((img: string, idx: number) => (
                            <motion.div
                              key={idx}
                              variants={{ hover: { y: -30 - (idx * 15), rotate: idx % 2 === 0 ? -8 : 8, x: idx % 2 === 0 ? -10 : 10, transition: { type: "spring", stiffness: 300, damping: 20 } } }}
                              className={cn("absolute left-4 right-4 h-28 rounded-lg border-2 border-white shadow-xl overflow-hidden z-[5]", idx === 0 ? "top-2 rotate-[-2deg]" : "top-4 rotate-[3deg]")}
                            >
                              <img src={img} className="w-full h-full object-cover" alt="" />
                            </motion.div>
                          ))}
                        </div>
                        <div className={cn("absolute bottom-0 left-0 right-0 h-28 rounded-2xl bg-gradient-to-br shadow-2xl z-10 p-5 flex flex-col justify-between overflow-hidden transition-all duration-500", cat.color)}>
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] group-hover:opacity-0 transition-opacity" />
                          <div className="relative z-20 flex justify-between items-start">
                            <cat.icon className="size-6 text-white/50 group-hover:text-white transition-colors" />
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest text-right leading-none">
                              {projects.length}<br/>Items
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
            <motion.div key="grid" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center justify-between mb-16 border-b border-slate-100 pb-12">
                <button onClick={() => setSelectedCat(null)} className="group flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-black transition-all">
                  <div className="size-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50">
                    <ChevronLeft className="size-4" />
                  </div>
                  Back to Folders
                </button>
                <div className="text-right">
                  <h2 className="font-display text-4xl font-light">{selectedCat}</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-2">{filteredWorks.length} Projects Detected</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pb-32">
                {filteredWorks.map((w, i) => (
                  <div key={w.id || i} className="relative group block rounded-[3rem] overflow-hidden bg-slate-100 aspect-[4/3] shadow-2xl border border-slate-50">
                    <div className="absolute inset-0 bg-slate-900">
                      <img
                        src={w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-70 group-hover:opacity-100"
                      />
                    </div>
                    
                    <div className="absolute top-8 right-8 z-30 size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[10px] font-black opacity-30 group-hover:opacity-100 transition-opacity">
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3 text-left">{w.cat || "Portfolio"}</p>
                          <h3 className="font-special-serif text-3xl text-white leading-tight text-left">{w.title || "Untitled Project"}</h3>
                        </div>
                        <p className="text-white/60 text-sm line-clamp-2 max-w-sm font-medium text-left">{w.problem || "Visit project details to explore more."}</p>
                        
                        {w.hasDetail ? (
                          <Link to={`/portfolio/${w.id}`} className="mt-6 inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                             Explore Story 
                             <div className="size-8 rounded-full bg-white text-black flex items-center justify-center">
                                <ArrowUpRight className="size-4" />
                             </div>
                          </Link>
                        ) : (
                          <a href="#contact" className="mt-6 inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                             Start Project
                             <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center">
                                <ArrowUpRight className="size-4" />
                             </div>
                          </a>
                        )}
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
