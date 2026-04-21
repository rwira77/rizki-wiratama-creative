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
              <img src={img || workBranding} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" alt="" />
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
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-right leading-none">
              {count}<br/>Items
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

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .order('year', { ascending: false });

        if (error) throw error;
        setWorks(data && data.length > 0 ? data : initialWorks);
      } catch (error) {
        console.error('Supabase Fetch Error:', error);
        setWorks(initialWorks);
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
    <section id="work" className="py-24 bg-white min-h-screen">
      <div className="container px-6 mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCat ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20"
            >
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-primary" /> Gallery
                </p>
                <h2 className="font-display text-5xl md:text-6xl font-light leading-tight tracking-tight">
                  Selected <em className="text-primary italic">works</em>.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
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
              <div className="flex items-center justify-between border-b border-slate-100 pb-12">
                <button 
                  onClick={() => setSelectedCat(null)}
                  className="group flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-black transition-all"
                >
                  <div className="size-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50">
                    <ChevronLeft className="size-4" />
                  </div>
                  Back to Folders
                </button>
                <div className="text-right">
                  <h2 className="font-display text-4xl font-light">{selectedCat}</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-2">
                    {filteredWorks.length} Projects Detected
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-8 pb-32">
                {filteredWorks.map((w, i) => {
                  const CardWrapper = ({ children, className }: any) => {
                    if (w.hasDetail) {
                      return <Link to={`/portfolio/${w.id}`} className={className}>{children}</Link>;
                    }
                    return <a href="#contact" className={className}>{children}</a>;
                  };

                  return (
                    <motion.div
                      key={`works-grid-${w.id || i}-${i}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="md:col-span-6 col-span-12"
                    >
                      <CardWrapper className="group block relative">
                        <div className={cn(
                          "relative overflow-hidden rounded-[3rem] bg-slate-50 shadow-2xl border border-slate-100",
                          w.aspect || "aspect-[4/3]"
                        )}>
                          {/* Image with Robust Fallback */}
                          <div className="absolute inset-0 bg-slate-200">
                            <img
                              src={w.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                              alt={w.title || "Project"}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                              onError={(e: any) => {
                                e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
                              }}
                            />
                          </div>
                          
                          {/* High-End Overlay */}
                          <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">
                                  {w.cat || "Portfolio"}
                                </p>
                                <h3 className="font-special-serif text-4xl text-white leading-tight">
                                  {w.title || "Untitled Project"}
                                </h3>
                              </div>
                              <p className="text-white/60 text-sm line-clamp-2 max-w-sm font-medium">
                                {w.problem || "View this dedicated project showcase for more details."}
                              </p>
                              <div className="pt-4 flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                 View Case Study 
                                 <div className="size-8 rounded-full bg-white text-black flex items-center justify-center">
                                    <ArrowUpRight className="size-4" />
                                 </div>
                              </div>
                            </div>
                          </div>

                          {/* Index Badge (Subtle) */}
                          <div className="absolute top-8 right-8 size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-black">
                            {String(i + 1).padStart(2, '0')}
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
