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
  Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Reliable Unsplash placeholders for initial setup
const workBranding = "https://images.unsplash.com/photo-1541462608141-ad4d60da3e8a?q=80&w=2670&auto=format&fit=crop";
const workEvent = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop";

export const initialWorks = [
  {
    id: "remlint-identity",
    title: "Remlint Visual Identity",
    cat: "Branding",
    img: workBranding,
    problem: "Outdated legacy perception",
    result: "120% increase in brand equity",
    year: "2024",
    span: "md:col-span-12",
    aspect: "aspect-[21/9]",
    hasDetail: true,
  },
  {
    id: "soiree-activation",
    title: "Soirée Activation",
    cat: "Branding",
    img: workEvent,
    problem: "Unmemorable launch event",
    result: "Sold-out collection in 48h",
    year: "2024",
    span: "md:col-span-7",
    aspect: "aspect-[4/3]",
    hasDetail: false,
  },
];

export const categories = [
  { id: "Branding", label: "Branding", icon: Palette, color: "from-blue-500 to-indigo-600", images: [workBranding, workEvent] },
  { id: "Social Media", label: "Social Media", icon: Share2, color: "from-purple-500 to-pink-600", images: [workBranding, workEvent] },
  { id: "Photography", label: "Photography", icon: Camera, color: "from-orange-500 to-red-600", images: [workBranding, workEvent] },
  { id: "Videography", label: "Videography", icon: Video, color: "from-emerald-500 to-teal-600", images: [workBranding, workEvent] },
  { id: "Graphic Design", label: "Graphic Design", icon: Layout, color: "from-slate-700 to-slate-900", images: [workBranding, workEvent] }
];

export const Portfolio = () => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const { data, error } = await supabase.from('works').select('*').order('year', { ascending: false });
        if (error) throw error;
        setWorks(data || []);
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorks();
  }, []);
  
  const filteredWorks = selectedCat 
    ? works.filter((w) => w.cat?.trim().toLowerCase() === selectedCat.toLowerCase())
    : [];

  return (
    <section id="work" className="py-24 min-h-screen bg-white">
      <div className="container px-6 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div key="folders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-20">
                <h2 className="text-5xl font-light mb-4">Our <span className="text-blue-600 italic">Work</span></h2>
                <p className="text-slate-400 uppercase tracking-widest text-xs">Categories ({works.length} Total Projects)</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className="group cursor-pointer text-center"
                  >
                    <div className={`aspect-square rounded-3xl bg-gradient-to-br ${cat.color} p-8 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform`}>
                       <cat.icon className="size-12 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-700">{cat.label}</h3>
                    <p className="text-xs text-slate-400">{works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase()).length} Projects</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-16">
                <button onClick={() => setSelectedCat(null)} className="text-blue-600 font-bold flex items-center gap-2">
                   <ChevronLeft className="size-4" /> Back
                </button>
                <div className="text-right">
                  <h2 className="text-3xl font-light">{selectedCat}</h2>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-widest">{filteredWorks.length} Projects Detected</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredWorks.map((w, i) => (
                  <div key={i} className="relative group rounded-[2.5rem] overflow-hidden bg-slate-900 aspect-[4/3] shadow-2xl border-4 border-slate-100">
                    {/* Badge */}
                    <div className="absolute top-6 left-6 z-30 bg-white text-black size-8 flex items-center justify-center rounded-full font-black shadow-xl">
                      {i + 1}
                    </div>

                    {/* Image */}
                    <img 
                      src={w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                      <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-2">{w.cat}</p>
                      <h3 className="text-white text-3xl font-serif mb-2">{w.title || "UNTITLED DATA"}</h3>
                      <p className="text-white/60 text-sm line-clamp-2">{w.problem || "No description provided."}</p>
                      <div className="mt-6 flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                        View Details <ChevronRight className="size-3" />
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
