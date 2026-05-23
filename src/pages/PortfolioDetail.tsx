import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowUpRight, Calendar, Tag, Target, BarChart3, ChevronRight, Share2, Heart, ExternalLink, X, Aperture } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useRef } from "react";
import { getOptimizedUrl } from "@/lib/cloudinary";

// Helper to determine if a URL is a video
const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)$/i.test(url || '');

const SmartMedia = ({ src, className, containerClassName, alt, type = 'image' }: any) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative bg-slate-50/50 overflow-hidden flex items-center justify-center", containerClassName || "w-full h-full")}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="size-5 rounded-full border-2 border-slate-200 border-t-primary/40 animate-spin" />
        </div>
      )}
      {type === 'video' ? (
        <video 
          src={src} 
          className={cn(className, "transition-opacity duration-1000", isLoaded ? "opacity-100" : "opacity-0")}
          onLoadedData={() => setIsLoaded(true)}
          autoPlay muted loop playsInline 
        />
      ) : (
        <img 
          src={src} 
          className={cn(className, "transition-opacity duration-1000", isLoaded ? "opacity-100" : "opacity-0")}
          onLoad={() => setIsLoaded(true)}
          alt={alt || ""} 
        />
      )}
    </div>
  );
};

const GridBlock = ({ block, work, isMobileView, getOptimizedUrl, isVideoUrl }: any) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const useSlider = isMobileView && (block.mobileView !== 'grid');

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPos = scrollRef.current.scrollLeft;
    const containerWidth = scrollRef.current.offsetWidth;
    // We use a small threshold to detect which item is most visible
    const idx = Math.round(scrollPos / (containerWidth * 0.85 + (work.grid_gap ?? 32)));
    setActiveIdx(idx);
  };

  return (
    <div className={cn(
      "w-full",
      useSlider && "-mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12"
    )}>
      <div 
        ref={scrollRef}
        onScroll={useSlider ? handleScroll : undefined}
        className={cn(
          "no-scrollbar w-full",
          useSlider 
            ? "flex overflow-x-auto snap-x snap-mandatory" 
            : "grid md:grid overflow-visible"
        )}
        style={{ 
          gap: `${work.grid_gap ?? 32}px`,
          gridTemplateColumns: useSlider 
            ? undefined 
            : `repeat(${block.columns || (isMobileView ? 1 : 2)}, minmax(0, 1fr))`
        }}
      >
        {Array.isArray(block.urls) && block.urls.map((url: string, j: number) => (
          <div 
            key={j} 
            className={cn(
              "overflow-hidden shadow-lg",
              useSlider ? "snap-center shrink-0 w-[85vw]" : "w-full"
            )}
          >
            <SmartMedia 
              src={isVideoUrl(url) ? url : getOptimizedUrl(url, 'gallery')}
              type={isVideoUrl(url) ? 'video' : 'image'}
              className="w-full h-auto block"
            />
          </div>
        ))}
      </div>
      {useSlider && block.urls && block.urls.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {block.urls.map((_: any, idx: number) => (
            <div 
              key={idx} 
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                activeIdx === idx ? "w-6 bg-slate-900" : "w-2 bg-slate-200"
              )} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
  const hasDetailedContent = Array.isArray(work.content_blocks) && work.content_blocks.length > 0;

  const content = (
    <div className="min-h-screen bg-[#FDFCF9] text-slate-900 selection:bg-primary/20">
      {/* Navigation Header - Hide in Modal Mode */}
      {!isModal && (
        <nav className="fixed top-0 md:top-8 left-0 right-0 h-20 px-8 md:px-12 flex items-center justify-between z-[100] bg-[#FDFCF9]/80 backdrop-blur-md border-b border-slate-100">
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

      <main className={cn("relative max-w-[1600px] mx-auto", isModal ? "pt-24 md:pt-12" : "pt-32")}>
        <div className="grid md:grid-cols-12 gap-0">
          {/* Main Case Study Content - Refined with Padding */}
          <div className="md:col-span-10 lg:col-span-10 px-4 md:px-8 lg:px-12 overflow-hidden">
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
                          <SmartMedia 
                            src={isVideoUrl(block.content) ? block.content : getOptimizedUrl(block.content, 'full')}
                            type={isVideoUrl(block.content) ? 'video' : 'image'}
                            className="w-full h-auto block"
                          />
                        </div>
                      )}

                      {block.type === 'grid' && (
                        <GridBlock 
                          block={block} 
                          work={work} 
                          isMobileView={typeof window !== 'undefined' && window.innerWidth < 768}
                          getOptimizedUrl={getOptimizedUrl}
                          isVideoUrl={isVideoUrl}
                        />
                      )}
                    </motion.div>
                  ))
               ) : (
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={cn(
                       "w-full flex justify-center",
                       isModal ? "h-full items-center" : ""
                     )}
                   >
                      <div className={cn(
                        "overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto",
                        isModal 
                          ? "max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-14rem)] w-auto max-w-full"
                          : "max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-18rem)] w-auto max-w-full"
                      )}>
                         <SmartMedia 
                           src={isVideoUrl(work.img) ? work.img : getOptimizedUrl(work.img, 'full')}
                           type={isVideoUrl(work.img) ? 'video' : 'image'}
                           containerClassName="w-auto h-auto max-h-full max-w-full flex items-center justify-center"
                           className="max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-14rem)] lg:max-h-[calc(100vh-16rem)] w-auto max-w-full object-contain block rounded-[2.5rem]"
                           alt={work.title}
                         />
                      </div>
                   </motion.div>
                )}
            </div>

            {/* Footer Navigation */}
            {(!isModal || hasDetailedContent) && (
              <div className="mt-16 md:mt-32 p-12 md:p-24 bg-slate-50 rounded-[4rem] text-center space-y-10 mb-20">
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
            )}
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
      {!isModal && (
        <footer className="py-20 px-8 text-center bg-[#FDFCF9] border-t border-slate-100">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Rizki Wiratama · Creative Dossier 2026</p>
        </footer>
      )}
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
            className="fixed top-12 right-6 md:top-8 md:right-8 z-[5100] size-10 md:size-12 rounded-full bg-slate-900/80 text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all shadow-2xl hover:scale-110 active:scale-95 group"
          >
            <X className="size-5 md:size-6" />
          </button>
          
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
};

export default PortfolioDetail;
