import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, Image as ImageIcon, Palette, Megaphone, Camera, Video, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// Standardizing image imports
import workBranding from "@/assets/work-branding.jpg";
import workSocial from "@/assets/work-social.jpg";
import workPhoto from "@/assets/work-photo.jpg";
import workVideo from "@/assets/work-video.jpg";
import workEvent from "@/assets/work-event.jpg";
import workCampaign from "@/assets/work-campaign.jpg";

export const categories = [
  { id: "Branding", label: "Branding", icon: Palette, color: "from-blue-500 to-indigo-600", images: [workBranding, workEvent] },
  { id: "Social Media", label: "Social Media", icon: Megaphone, color: "from-purple-500 to-fuchsia-600", images: [workSocial] },
  { id: "Photography", label: "Photography", icon: Camera, color: "from-orange-500 to-rose-600", images: [workPhoto, workCampaign] },
  { id: "Videography", label: "Videography", icon: Video, color: "from-emerald-500 to-teal-600", images: [workVideo] },
  { id: "Graphic Design", label: "Graphic Design", icon: PenTool, color: "from-amber-500 to-yellow-600", images: [workBranding] },
];

export const initialWorks = [
  {
    id: "remlint-identity",
    title: "Remlint Identity",
    cat: "Branding",
    img: workBranding,
    problem: "Generic, undifferentiated label",
    result: "Premium brand recall +210%",
    year: "2025",
    span: "md:col-span-7",
    aspect: "aspect-[4/3]",
    hasDetail: true,
  },
  {
    id: "maison-editorial",
    title: "Maison Editorial",
    cat: "Photography",
    img: workPhoto,
    problem: "Flat product imagery",
    result: "CTR +68% across paid",
    year: "2025",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
    hasDetail: false,
  },
  {
    id: "atelier-social",
    title: "Atelier Social System",
    cat: "Social Media",
    img: workSocial,
    problem: "Inconsistent feed, low engagement",
    result: "+340% followers in 9 months",
    year: "2024",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
    hasDetail: true,
  },
  {
    id: "runway-24",
    title: "Runway 24 Campaign",
    cat: "Videography",
    img: workVideo,
    problem: "No video presence",
    result: "2.4M organic reach",
    year: "2024",
    span: "md:col-span-7",
    aspect: "aspect-[4/3]",
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
  {
    id: "soft-form",
    title: "Soft Form Campaign",
    cat: "Photography",
    img: workCampaign,
    problem: "Weak seasonal positioning",
    result: "+85% online sales QoQ",
    year: "2023",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
    hasDetail: false,
  },
];

const PortfolioFolder = ({ category, count, projects, onClick }: { category: any, count: number, projects: any[], onClick: () => void }) => {
  // Use real project images for preview, fallback to category defaults if empty
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
        {/* Back Flap */}
        <div className={cn(
          "absolute top-0 left-0 w-2/3 h-4 rounded-t-xl bg-gradient-to-br opacity-90",
          category.color
        )} />
        
        {/* Sticking Out Images */}
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

        {/* Regular Folder Papers */}
        <div className="absolute top-2 left-6 right-6 h-28 bg-white/80 rounded-lg shadow-sm -rotate-1 z-0 group-hover:-translate-y-4 transition-transform duration-500" />

        {/* Front Flap */}
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
  const [works, setWorks] = useState(initialWorks);
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
    <section id="work" className="py-4">
      <AnimatePresence mode="wait">
        {!selectedCat ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-12"
          >
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-8">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-primary" /> Gallery
                  {isLive ? (
                    <div className="flex items-center gap-2">
                      <span className="ml-4 px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black rounded-full animate-pulse">DB LIVE ({works.length} Projects)</span>
                      <button 
                        onClick={() => alert(JSON.stringify(works, null, 2))}
                        className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[8px] font-black rounded-full hover:bg-slate-300 transition-colors"
                      >
                        INSPECT FULL DATA
                      </button>
                    </div>
                  ) : (
                    <span className="ml-4 px-2 py-0.5 bg-slate-100 text-slate-400 text-[8px] font-black rounded-full">STATIC MODE (Sample Data)</span>
                  )}
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-light leading-tight tracking-tight">
                  Organized by <em className="text-primary italic">discipline</em>.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32 pt-16 pb-32 justify-items-center max-w-4xl mx-auto">
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
                <ChevronLeft className="size-4" /> Back to Files
              </button>
              <h2 className="font-display text-2xl font-light">
                {selectedCat} <span className="opacity-20 ml-2">/</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-12 gap-6 pb-20">
              {filteredWorks.map((w, i) => {
                const CardWrapper = ({ children, className }: any) => {
                  if (w.hasDetail) {
                    return <Link to={`/portfolio/${w.id}`} className={className}>{children}</Link>;
                  }
                  return <a href="#contact" className={className}>{children}</a>;
                };

                return (
                  <motion.div
                    key={w.id || `work-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                    className={w.span ?? "md:col-span-6"}
                  >
                    <CardWrapper className="group block">
                      <div className={`relative overflow-hidden rounded-3xl bg-muted shadow-lg ${w.aspect}`}>
                        <img
                          src={w.img}
                          alt={`${w.title} — ${w.cat} case study`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                          <div className="flex items-end justify-between gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2 font-bold">
                                {w.cat} · {w.year}
                              </p>
                              <h3 className="font-display text-2xl md:text-3xl font-light">{w.title}</h3>
                            </div>
                            <span className="size-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md transition-all duration-500 group-hover:bg-white group-hover:text-black group-hover:rotate-45">
                              <ArrowUpRight className="size-4" />
                            </span>
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
    </section>
  );
};
