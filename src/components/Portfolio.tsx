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
      <div className="container px-6 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div key="folders" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-20">
              <div className="max-w-2xl px-4">
                <p className="text-xs uppercase tracking-[0.4em] text-primary mb-4">Portfolio</p>
                <h2 className="font-display text-4xl md:text-5xl font-light text-slate-900 leading-tight">
                  Discover our creative <br/> <em className="text-primary italic font-serif">universe</em>.
                </h2>
              </div>
              
              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-12 gap-y-24 justify-items-center">
                {categories.map((cat) => {
                  const catProjects = works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase());
                  const previewImages = catProjects.length > 0 ? catProjects.slice(0, 2).map(p => p.img) : (cat as any).images;
                  
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover="hover"
                      onClick={() => setSelectedCat(cat.id)}
                      className="group cursor-pointer flex flex-col items-center w-full max-w-[180px]"
                    >
                      <div className="relative w-full aspect-[4/5] mb-6">
                        <div className={cn("absolute -top-2 left-0 w-1/2 h-3 rounded-t-xl opacity-40 transition-transform group-hover:-translate-y-1", cat.color)} />
                        <div className="absolute inset-0 z-0">
                          {previewImages.map((img: string, idx: number) => (
                            <motion.div
                              key={idx}
                              variants={{ hover: { y: -30 - (idx * 15), rotate: idx % 2 === 0 ? -12 : 12, scale: 1.05, transition: { type: "spring", stiffness: 200, damping: 15 } } }}
                              className={cn("absolute inset-0 rounded-2xl border-2 border-white shadow-xl overflow-hidden z-[5]", idx === 0 ? "rotate-[-3deg] translate-y-1" : "rotate-[4deg] translate-y-3")}
                            >
                              <img src={img || workBranding} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt="" />
                            </motion.div>
                          ))}
                        </div>
                        <div className={cn("absolute bottom-0 left-0 right-0 h-full rounded-2xl bg-gradient-to-br shadow-2xl z-10 p-6 flex flex-col justify-between overflow-hidden transition-all duration-500", cat.color)}>
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                           <div className="relative z-20 flex justify-between items-start">
                              <cat.icon className="size-8 text-white/80 group-hover:text-white transition-colors" />
                              <div className="text-right">
                                <p className="text-[10px] font-black text-white/50">{catProjects.length}</p>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Items</p>
                              </div>
                           </div>
                           <div className="relative z-20">
                              <div className="h-0.5 w-8 bg-white/40 rounded-full mb-1.5" />
                              <div className="h-0.5 w-12 bg-white/20 rounded-full" />
                           </div>
                        </div>
                      </div>
                      <h3 className="font-display text-lg text-slate-800 font-medium group-hover:text-primary transition-colors text-center">{cat.label}</h3>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-10 px-4">
                <button onClick={() => setSelectedCat(null)} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
                  <ChevronLeft className="size-4" /> Back
                </button>
                <div className="text-right">
                  <h2 className="font-display text-4xl font-light text-slate-900 tracking-tight">{selectedCat}</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">{sortedWorks.length} Projects</p>
                </div>
              </div>

              {/* Pinterest Style Masonry */}
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-4 pb-40">
                {sortedWorks.map((w, i) => (
                  <motion.div 
                    key={w.id || i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="break-inside-avoid relative group cursor-pointer"
                  >
                    <Link to={w.hasDetail ? `/portfolio/${w.id}` : "#contact"} className="block overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                      <div className={cn(
                        "relative w-full",
                        i % 2 === 0 ? "aspect-[4/5]" : "aspect-[3/4]"
                      )}>
                        {/* Image */}
                        <img
                          src={w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                          alt={w.title}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                        />
                        
                        {/* Pinterest Style Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/80 mb-2">{w.cat}</p>
                            <h3 className="font-special-serif text-2xl text-white mb-3">{w.title}</h3>
                            
                            <div className="flex items-center justify-between mt-auto">
                               <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                                  {w.hasDetail ? "Case Study" : "Creative"}
                               </div>
                               <div className="size-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                  <Plus className="size-5" />
                               </div>
                            </div>
                          </div>
                        </div>

                        {/* Subtle Badge for Detail Page */}
                        {w.hasDetail && (
                          <div className="absolute top-5 right-5 z-20 size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-0 transition-transform">
                             <ArrowUpRight className="size-4" />
                          </div>
                        )}
                      </div>
                    </Link>
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
