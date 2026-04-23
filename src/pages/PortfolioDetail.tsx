import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowUpRight, Calendar, Tag, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { getOptimizedUrl } from "@/lib/cloudinary";

import { X } from "lucide-react";

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
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 h-20 px-8 md:px-12 flex items-center justify-between z-50 bg-[#FDFCF9]/80 backdrop-blur-md border-b border-slate-100">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Works
        </button>
        <div className="hidden md:flex items-center gap-8">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Case Study 2026</span>
           <div className="size-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-16 px-8 md:px-12 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="space-y-4 text-left"
        >
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
             {work.cat}
           </p>
           <h1 className="font-special-serif text-4xl md:text-6xl tracking-tight text-slate-900">
             {work.title}
           </h1>
           <div className="pt-4 flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-300">
              <span>Case Study 2026</span>
              <div className="size-1 rounded-full bg-slate-100" />
              <span>Rizki Wiratama</span>
           </div>
        </motion.div>
      </header>

      <main className="relative max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-12 gap-0">
          {/* Main Case Study Content - Refined with Padding */}
          <div className="md:col-span-9 lg:col-span-10 px-4 md:px-12 lg:px-20">
            <div 
              className="flex flex-col"
              style={{ gap: `${work.block_gap ?? 80}px` }}
            >
               {Array.isArray(work.content_blocks) && work.content_blocks.length > 0 ? (
                  work.content_blocks.map((block: any, i: number) => (
                    <motion.div
                      key={block.id || i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-5%" }}
                      transition={{ duration: 0.8 }}
                      className="w-full"
                    >
                      {block.type === 'text' && (
                        <div className="py-12 md:py-20">
                          <div className={cn(
                            "mr-auto",
                            block.style === 'quote' ? "max-w-4xl" : "max-w-2xl"
                          )}>
                            {block.style === 'heading' ? (
                              <h2 className="font-special-serif text-3xl md:text-5xl text-slate-900 mb-8 tracking-tight">{block.content}</h2>
                            ) : block.style === 'quote' ? (
                              <div className="space-y-8">
                                 <div className="h-1 w-12 bg-primary" />
                                 <p className="font-special-serif text-3xl md:text-5xl italic text-slate-900 leading-tight">
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
                          <img 
                            src={getOptimizedUrl(block.content, 'full')} 
                            className="w-full h-auto block" 
                            alt="" 
                          />
                        </div>
                      )}

                      {block.type === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                          {Array.isArray(block.urls) && block.urls.map((url: string, j: number) => (
                            <div key={j} className="overflow-hidden shadow-lg">
                              <img 
                                src={getOptimizedUrl(url, 'gallery')} 
                                className="w-full h-auto block hover:scale-105 transition-transform duration-1000" 
                                alt="" 
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
               ) : (
                  <div className="py-40 text-center text-slate-300">
                     <p className="text-sm font-bold uppercase tracking-widest">No Content Blocks Defined</p>
                     <p className="text-xs">Add blocks in Admin Dashboard to build your case study.</p>
                  </div>
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
          <aside className="hidden md:block md:col-span-3 lg:col-span-2">
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
