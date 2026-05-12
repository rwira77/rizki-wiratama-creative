import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowUpRight, Calendar, Tag, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { getOptimizedUrl } from "@/lib/cloudinary";

import { X } from "lucide-react";

// Helper to determine if a URL is a video
const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)$/i.test(url || '');

const PortfolioDetail = ({ isModal = false }: { isModal?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setWork(data);
      } catch (error) {
        console.error('Error fetching work:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWork();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-special-serif">Project Not Found</h1>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">Return Home</button>
        </div>
      </div>
    );
  }

  const content = (
    <div className="min-h-screen bg-[#FDFCF9] text-slate-900 selection:bg-primary/20">
      {/* Navigation Header - Hide in Modal Mode */}
      {!isModal && (
        <nav className="fixed top-0 left-0 right-0 h-20 px-8 md:px-12 flex items-center justify-between z-50 bg-[#FDFCF9]/80 backdrop-blur-md border-b border-slate-100">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
          >
            <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">Project</span>
                <span className="text-sm font-bold text-slate-900 leading-none">{work.title}</span>
             </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <div className={cn("relative w-full bg-slate-50 overflow-hidden", isModal ? "h-[50vh] md:h-[60vh]" : "h-[60vh] md:h-[85vh]")}>
        {isVideoUrl(work.img) ? (
          <video 
            src={work.img} 
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            loop 
            playsInline 
          />
        ) : (
          <img 
            src={work.img} 
            alt={work.title} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF9] via-transparent to-transparent opacity-60" />
      </div>

      <main className="relative max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-12 gap-0">
          {/* Main Case Study Content - Refined with Padding */}
          <div className="md:col-span-10 lg:col-span-10 px-4 md:px-8 lg:px-12">
            <div 
              className="flex flex-col min-w-0"
              style={{ gap: `${work.block_gap ?? 80}px` }}
            >
               {Array.isArray(work.content_blocks) && work.content_blocks.length > 0 ? (
                  work.content_blocks.map((block: any, i: number) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="w-full"
                    >
                      {block.type === 'text' && (
                        <div className="max-w-4xl">
                           <div className="flex flex-col gap-6">
                            {block.title && <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary/60">{block.title}</h3>}
                            {block.content && block.content.length > 150 ? (
                              <div className="relative">
                                 <div className="absolute -left-6 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
                                 <p className="text-lg md:text-2xl font-light text-slate-700 leading-relaxed font-sans italic">
                                   "{block.content}"
                                 </p>
                              </div>
                            ) : (
                              <p className="text-lg md:text-2xl font-light text-slate-500 leading-relaxed font-sans">
                                {block.content}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="w-full overflow-hidden shadow-xl bg-slate-50">
                          {isVideoUrl(block.content) ? (
                            <video 
                              src={block.content} 
                              className="w-full h-auto block" 
                              autoPlay 
                              muted 
                              loop 
                              playsInline 
                            />
                          ) : (
                            <img 
                              src={getOptimizedUrl(block.content, 'full')} 
                              className="w-full h-auto block" 
                              alt="" 
                            />
                          )}
                        </div>
                      )}

                      {block.type === 'grid' && (
                        <div 
                          className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                          style={{ 
                            gap: `${work.grid_gap ?? 32}px`,
                            gridTemplateColumns: (typeof window !== 'undefined' && window.innerWidth >= 768) 
                              ? `repeat(${block.columns || 2}, minmax(0, 1fr))` 
                              : undefined
                          }}
                        >
                          {Array.isArray(block.urls) && block.urls.map((url: string, j: number) => (
                            <div key={j} className="overflow-hidden shadow-lg snap-center shrink-0 w-[85vw] md:w-full">
                                {isVideoUrl(url) ? (
                                  <video 
                                    src={url} 
                                    className="w-full h-auto block hover:scale-105 transition-transform duration-1000" 
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline 
                                  />
                                ) : (
                                  <img 
                                    src={getOptimizedUrl(url, 'gallery')} 
                                    className="w-full h-auto block hover:scale-105 transition-transform duration-1000" 
                                    alt="" 
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                      )}
                    </motion.div>
                  ))
               ) : (
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="w-full"
                   >
                     <div className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-50 border border-slate-100">
                        {isVideoUrl(work.img) ? (
                          <video 
                            src={work.img} 
                            className="w-full h-auto block" 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                          />
                        ) : (
                          <img 
                            src={getOptimizedUrl(work.img, 'full')} 
                            className="w-full h-auto block" 
                            alt={work.title} 
                          />
                        )}
                     </div>
                   </motion.div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="mt-32 p-12 md:p-24 bg-slate-50 rounded-[4rem] text-center space-y-10 mb-20">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Next Project</p>
                  <h3 className="font-special-serif text-4xl md:text-6xl tracking-tight hover:text-primary transition-colors cursor-pointer">Stay Tuned</h3>
               </div>
               <button 
                  onClick={() => navigate("/")}
                  className="px-10 py-4 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
               >
                  Back to Portfolio
               </button>
            </div>
          </div>

          {/* Sticky Sidebar Info - Refined */}
          <aside className="hidden md:block md:col-span-2 lg:col-span-2">
            <div className="sticky top-32 p-6 space-y-12">
               <div className="space-y-8">
                  <div className="space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Timeline</p>
                     <p className="font-bold text-xs">{work.year}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Discipline</p>
                     <p className="font-bold text-xs">{work.cat}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-primary">Result</p>
                     <p className="font-special-serif text-lg italic leading-tight">{work.result}</p>
                  </div>
               </div>

               <div className="h-px bg-slate-100" />

               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-[10px]">RW</div>
                     <div>
                        <p className="text-[10px] font-bold">Rizki Wiratama</p>
                        <p className="text-[8px] text-slate-300 uppercase tracking-widest font-black">Creator</p>
                     </div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Meta Info */}
      <div className="md:hidden p-8 bg-white border-t border-slate-100 space-y-8">
         <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Timeline</p>
               <p className="font-bold text-sm">{work.year}</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Discipline</p>
               <p className="font-bold text-sm">{work.cat}</p>
            </div>
         </div>
      </div>

      {/* Footer */}
      <footer className="py-20 px-8 text-center bg-white border-t border-slate-100">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Rizki Wiratama · Creative Dossier 2026</p>
      </footer>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[5000] flex items-center justify-center p-0 md:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => navigate(-1)}
          className="absolute inset-0 bg-slate-900/90 backdrop-blur-md cursor-zoom-out"
        />
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="relative w-full max-w-7xl h-full bg-white overflow-y-auto custom-scrollbar shadow-2xl md:rounded-3xl"
        >
          {/* Floating Close Button */}
          <button 
            onClick={() => navigate(-1)}
            className="fixed top-8 right-8 z-[5100] size-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all shadow-2xl group"
          >
            <X className="size-6 group-hover:scale-110 transition-transform" />
          </button>
          
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
};

export default PortfolioDetail;
