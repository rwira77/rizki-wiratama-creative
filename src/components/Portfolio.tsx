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
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// Reliable Unsplash placeholders for initial setup
const workBranding = "https://images.unsplash.com/photo-1541462608141-ad4d60da3e8a?q=80&w=2670&auto=format&fit=crop";
const workEvent = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop";
const workSocial = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop";
const workCampaign = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop";
const workDesign = "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop";

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
  { id: "Social Media", label: "Social Media", icon: Share2, color: "from-purple-500 to-pink-600", images: [workSocial, workCampaign] },
  { id: "Photography", label: "Photography", icon: Camera, color: "from-orange-500 to-red-600", images: [workCampaign, workBranding] },
  { id: "Videography", label: "Videography", icon: Video, color: "from-emerald-500 to-teal-600", images: [workEvent, workSocial] },
  { id: "Graphic Design", label: "Graphic Design", icon: Layout, color: "from-slate-700 to-slate-900", images: [workBranding, workSocial] }
];

const PortfolioFolder = ({ category, count, projects, onClick }: { category: any, count: number, projects: any[], onClick: () => void }) => {
  const previewImages = projects.length > 0 
    ? projects.slice(0, 2).map(p => p.img) 
    : category.images;

  return (
    <motion.div
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center"
    >
      <div className="relative w-48 h-40 mb-4 transition-all duration-500">
        <div className={cn(
          "absolute top-0 left-0 w-2/3 h-4 rounded-t-xl bg-gradient-to-br opacity-90",
          category.color
        )} />
        
        <div className="absolute inset-0 z-0">
          {previewImages.map((img: string, idx: number) => (
            <motion.div
              key={idx}
              variants={{
                hover: { 
                  y: -40 - (idx * 20), 
                  rotate: idx % 2 === 0 ? -8 : 8,
                  x: idx % 2 === 0 ? -10 : 10,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }
              }}
              className={cn(
                "absolute left-4 right-4 h-32 rounded-lg border-2 border-white shadow-xl overflow-hidden z-[5]",
                idx === 0 ? "top-2 rotate-[-2deg]" : "top-4 rotate-[3deg]"
              )}
            >
              <img src={img} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" alt="" />
            </motion.div>
          ))}
        </div>

        <div className="absolute top-2 left-6 right-6 h-28 bg-white/80 rounded-lg shadow-sm -rotate-1 z-0 group-hover:-translate-y-4 transition-transform duration-500" />

        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-32 rounded-2xl bg-gradient-to-br shadow-2xl z-10 p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:translate-x-1 group-hover:rotate-1",
          category.color
        )}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] group-hover:opacity-0 transition-opacity" />
          
          <div className="relative z-20 flex justify-between items-start">
            <category.icon className="size-8 text-white/50 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              {count} Items
            </span>
          </div>
          
          <div className="relative z-20">
            <div className="h-1 w-8 bg-white/40 rounded-full mb-2" />
            <div className="h-1 w-12 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
      <h3 className="font-display text-xl text-black/80 font-medium group-hover:text-primary transition-colors">{category.label}</h3>
    </motion.div>
  );
};

export const Portfolio = () => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [works, setWorks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .order('year', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setWorks(data);
          setIsLive(true);
        } else {
          setWorks(initialWorks);
          setIsLive(false);
        }
      } catch (error) {
        console.error('Supabase Fetch Error:', error);
        setWorks(initialWorks);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, []);
  
  const filteredWorks = selectedCat 
    ? works.filter((w) => w.cat?.trim().toLowerCase() === selectedCat.toLowerCase())
    : works;

  return (
    <section id="work" className="py-24">
      <div className="container px-6 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-12 gap-12 items-end mb-20">
                <div className="md:col-span-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                    <span className="h-px w-8 bg-primary" /> Gallery
                  </p>
                  <h2 className="font-display text-4vh md:text-5xl font-light leading-tight tracking-tight">
                    Organized by <em className="text-primary italic">discipline</em>.
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
                {categories.map((cat) => (
                  <PortfolioFolder 
                    key={cat.id} 
                    category={cat} 
                    count={works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase()).length}
                    projects={works.filter(w => w.cat?.trim().toLowerCase() === cat.id.toLowerCase())}
                    onClick={() => setSelectedCat(cat.id)} 
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedCat(null)}
                  className="flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black transition-colors"
                >
                  <ChevronLeft className="size-4" /> Back to Folders
                </button>
                <h2 className="font-display text-2xl font-light">
                  {selectedCat} <span className="opacity-20 ml-2">/</span>
                  <span className="ml-4 text-xs font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-lg">
                    {filteredWorks.length} Projects Detected
                  </span>
                </h2>
              </div>

              <div className="grid md:grid-cols-12 gap-10 pb-20">
                {filteredWorks.map((w, i) => {
                  const CardWrapper = ({ children, className }: any) => {
                    if (w.hasDetail) {
                      return <Link to={`/portfolio/${w.id}`} className={className}>{children}</Link>;
                    }
                    return <a href="#contact" className={className}>{children}</a>;
                  };

                  return (
                    <motion.div
                      key={`works-grid-${w.id}-${i}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: i * 0.1 }}
                      className="md:col-span-6 col-span-12"
                    >
                      <CardWrapper className="group block relative">
                        {/* Debug Index Badge */}
                        <div className="absolute top-4 left-4 z-30 bg-white text-black text-[10px] font-black size-6 flex items-center justify-center rounded-full shadow-xl">
                          {i + 1}
                        </div>
                        
                        <div className={cn(
                          "relative overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-xl border border-slate-50",
                          w.aspect || "aspect-[4/3]"
                        )}>
                          {w.img ? (
                            <img
                              src={w.img}
                              alt={w.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.08]"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                               <ImageIcon className="size-12" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-all duration-500">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">{w.cat}</p>
                            <h3 className="font-special-serif text-3xl text-white mb-2">{w.title}</h3>
                            <p className="text-white/60 text-sm line-clamp-2 max-w-md">{w.problem}</p>
                            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                               View Case Study <ChevronRight className="size-3" />
                            </div>
                          </div>
                        </div>
                      </CardWrapper>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
