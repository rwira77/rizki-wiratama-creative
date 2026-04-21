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
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const workBranding = "https://images.unsplash.com/photo-1541462608141-ad4d60da3e8a?q=80&w=2670&auto=format&fit=crop";
const workEvent = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop";

export const initialWorks = [
  { id: "remlint-identity", title: "Remlint Visual Identity", cat: "Branding", img: workBranding, problem: "Outdated legacy perception", year: "2024", hasDetail: true },
  { id: "soiree-activation", title: "Soirée Activation", cat: "Branding", img: workEvent, problem: "Unmemorable launch event", year: "2024", hasDetail: false }
];

export const categories = [
  { id: "Branding", label: "Branding", icon: Palette, color: "from-blue-500 to-indigo-600" },
  { id: "Social Media", label: "Social Media", icon: Share2, color: "from-purple-500 to-pink-600" },
  { id: "Photography", label: "Photography", icon: Camera, color: "from-orange-500 to-red-600" },
  { id: "Videography", label: "Videography", icon: Video, color: "from-emerald-500 to-teal-600" },
  { id: "Graphic Design", label: "Graphic Design", icon: Layout, color: "from-slate-700 to-slate-900" }
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
    <section id="work" className="py-24 bg-white min-h-screen">
      <div className="container px-6 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-20">
                <h2 className="text-5xl font-light">Selected <em className="text-blue-600 italic">Work</em></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                {categories.map((cat) => (
                  <div key={cat.id} onClick={() => setSelectedCat(cat.id)} className="group cursor-pointer">
                    <div className={`aspect-square rounded-3xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform`}>
                       <cat.icon className="size-10 text-white" />
                    </div>
                    <h3 className="mt-4 text-center font-bold text-slate-700">{cat.label}</h3>
                    <p className="text-center text-xs text-slate-400">{works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase()).length} Projects</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-16 border-b border-slate-100 pb-10">
                <button onClick={() => setSelectedCat(null)} className="flex items-center gap-2 font-bold text-blue-600">
                  <ChevronLeft className="size-4" /> Back to Folders
                </button>
                <div className="text-right">
                  <h2 className="text-4xl font-light">{selectedCat}</h2>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-widest">{filteredWorks.length} Projects Detected</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredWorks.map((w, i) => (
                  <div key={w.id || i} className="relative group block rounded-[3rem] overflow-hidden bg-slate-100 aspect-[4/3] shadow-2xl border border-slate-200">
                    {/* Background Image Container */}
                    <div className="absolute inset-0 bg-slate-900">
                      <img
                        src={w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                      />
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute top-8 right-8 z-20 size-8 bg-white text-black text-xs font-black flex items-center justify-center rounded-full shadow-lg">
                      {i + 1}
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black via-black/30 to-transparent">
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">{w.cat}</p>
                      <h3 className="text-white text-3xl font-serif mb-2">{w.title || "Untitled Project"}</h3>
                      <p className="text-white/60 text-sm line-clamp-2 max-w-sm">{w.problem || "View details for this project showcase."}</p>
                      
                      {w.hasDetail ? (
                        <Link to={`/portfolio/${w.id}`} className="mt-6 flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest group/btn">
                           Explore Story 
                           <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                              <ArrowUpRight className="size-4" />
                           </div>
                        </Link>
                      ) : (
                        <a href="#contact" className="mt-6 flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest group/btn">
                           Start Project
                           <div className="size-8 rounded-full bg-slate-600 text-white flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                              <ArrowUpRight className="size-4" />
                           </div>
                        </a>
                      )}
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
