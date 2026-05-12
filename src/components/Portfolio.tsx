import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Share2, 
  Camera, 
  Video, 
  Layout, 
  ChevronLeft,
  ArrowUpRight,
  Plus,
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { DesktopIcon } from "@/components/DesktopIcon";
import { getOptimizedUrl } from "@/lib/cloudinary";

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
  { id: "Graphic Design", label: "Graphic Design", icon: Layout, color: "from-slate-700 to-slate-900", images: [workBranding, workSocial] },
  { id: "Campaign & Event", label: "Campaign & Event", icon: Megaphone, color: "from-amber-500 to-orange-600", images: [workEvent, workCampaign] }
];

// Helper to determine if a URL is a video
const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)$/i.test(url || '');

export const Portfolio = ({ 
  selectedCat, 
  setSelectedCat 
}: { 
  selectedCat: string | null; 
  setSelectedCat: (cat: string | null) => void;
}) => {
  const [works, setWorks] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .order('order_index', { ascending: true });
        if (error) throw error;
        setWorks(data && data.length > 0 ? data : initialWorks);
      } catch (error) {
        setWorks(initialWorks);
      }
    };
    fetchWorks();
  }, []);

  useEffect(() => {
    // Reset scroll to top when category changes (back to folders or switching categories)
    const scrollContainer = document.querySelector('.custom-scrollbar');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0 });
    }
  }, [selectedCat]);
  
  const filteredWorks = selectedCat 
    ? works.filter((w) => w.cat?.trim().toLowerCase() === selectedCat.toLowerCase())
    : works;

  const sortedWorks = filteredWorks;

  return (
    <section id="work" className="pt-0 pb-24 bg-transparent min-h-screen">
      <div className="max-w-[1200px] px-4 md:px-8 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div key="folders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-12 md:mb-20 max-w-2xl px-0">
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-primary" /> Gallery
                </p>
                <h2 className="font-display text-3xl md:text-6xl font-light leading-tight tracking-tight text-slate-900 uppercase">
                   <em className="text-primary italic">Portfolio</em>.
                </h2>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6 md:gap-12 justify-items-center">
                {categories.map((cat) => {
                  const catProjects = works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase());
                  return (
                    <DesktopIcon
                      key={cat.id}
                      id={cat.id}
                      label={cat.label}
                      icon={cat.icon}
                      color={cat.color}
                      subtext={`${catProjects.length}`}
                      onClick={() => setSelectedCat(cat.id)}
                    />
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="sticky top-0 z-[100] flex md:hidden items-center gap-8 py-2.5 mb-6 -mx-4 px-4 bg-[#FDFCF9]/95 backdrop-blur-md border-b border-slate-100/50">
                <button onClick={() => setSelectedCat(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.3em]">
                   <ChevronLeft className="size-3.5" /> Back
                </button>
                <div className="h-3 w-px bg-slate-200" />
                <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">{selectedCat}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-12 gap-y-12 md:gap-y-24 pb-48 px-0">
                {sortedWorks.map((w, i) => (
                  <motion.div 
                    key={w.id || i} 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="break-inside-avoid relative"
                  >
                    <Link 
                      to={`/portfolio/${w.id}`} 
                      state={{ backgroundLocation: location }}
                      className="block group"
                    >
                      {/* Image Container - SUBTLE ROUNDED */}
                      <div className="overflow-hidden bg-slate-50 border border-slate-100 rounded-xl relative group-hover:shadow-xl transition-shadow duration-500">
                        {isVideoUrl(w.img) ? (
                          <video
                            src={w.img}
                            className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={getOptimizedUrl(w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", 'thumb')}
                            alt={w.title}
                            className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
                          />
                        )}
                      </div>
                      
                      {/* Text Content - Static below image */}
                      <div className="mt-6 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-special-serif text-lg md:text-2xl text-slate-900 leading-tight">
                            {w.title}
                          </h3>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                          {w.cat} — {w.year}
                        </p>
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
