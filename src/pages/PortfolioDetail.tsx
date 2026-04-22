import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowUpRight, Calendar, Tag, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { getOptimizedUrl } from "@/lib/cloudinary";

const PortfolioDetail = () => {
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

  return (
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
      <header className="pt-40 pb-20 px-8 md:px-12 max-w-7xl mx-auto text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4"
        >
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
             {work.cat}
           </p>
           <h1 className="font-special-serif text-6xl md:text-[10rem] leading-[0.85] tracking-tighter text-slate-900">
             {work.title}
           </h1>
           <div className="pt-8 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Published 2026</span>
              <div className="size-1 rounded-full bg-slate-200" />
              <span>Rizki Wiratama</span>
           </div>
        </motion.div>
      </header>

      <main className="relative">
        <div className="grid md:grid-cols-12 gap-0">
          {/* Main Case Study Content - Behance Style (Full Width Focus) */}
          <div className="md:col-span-9 lg:col-span-10">
            <div className="flex flex-col">
               {Array.isArray(work.content_blocks) && work.content_blocks.length > 0 ? (
                  work.content_blocks.map((block: any, i: number) => (
                    <motion.div
                      key={block.id || i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.8 }}
                      className="w-full"
                    >
                      {block.type === 'text' && (
                        <div className="py-24 px-8 md:px-24 bg-white">
                          <div className={cn(
                            "mx-auto",
                            block.style === 'quote' ? "max-w-4xl" : "max-w-3xl"
                          )}>
                            {block.style === 'heading' ? (
                              <h2 className="font-special-serif text-5xl md:text-8xl text-slate-900 mb-12 tracking-tighter">{block.content}</h2>
                            ) : block.style === 'quote' ? (
                              <div className="space-y-10">
                                 <div className="h-1.5 w-20 bg-primary" />
                                 <p className="font-special-serif text-4xl md:text-7xl italic text-slate-900 leading-[1.1] tracking-tight">
                                   "{block.content}"
                                 </p>
                              </div>
                            ) : (
                              <p className="text-xl md:text-4xl font-light text-slate-500 leading-tight font-sans">
                                {block.content}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="w-full bg-slate-50">
                          <img 
                            src={getOptimizedUrl(block.content, 'gallery')} 
                            className="w-full h-auto block" 
                            alt="" 
                          />
                        </div>
                      )}

                      {block.type === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-slate-50">
                          {Array.isArray(block.urls) && block.urls.map((url: string, j: number) => (
                            <div key={j} className="overflow-hidden">
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
                  <div className="flex flex-col">
                     {/* Hero as first image if no blocks */}
                     <img src={getOptimizedUrl(work.img, 'hero')} className="w-full h-auto" alt="" />
                     
                     <div className="py-32 px-8 md:px-24 bg-white">
                        <div className="max-w-3xl mx-auto space-y-10">
                           <h2 className="font-special-serif text-6xl md:text-8xl tracking-tighter">The Mission</h2>
                           <p className="text-2xl md:text-5xl font-light text-slate-500 leading-[1.1]">
                              {work.problem}
                           </p>
                        </div>
                     </div>

                     {Array.isArray(work.gallery) && work.gallery.map((imgUrl: string, idx: number) => (
                       <img 
                         key={idx}
                         src={getOptimizedUrl(imgUrl, 'gallery')} 
                         className="w-full h-auto block" 
                         alt="" 
                       />
                     ))}
                  </div>
               )}
            </div>

            {/* Footer Navigation */}
            <div className="p-12 md:p-32 bg-slate-900 text-white text-center space-y-12">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Next Project</p>
                  <h3 className="font-special-serif text-5xl md:text-9xl tracking-tighter hover:text-primary transition-colors cursor-pointer">Stay Tuned</h3>
               </div>
               <button 
                  onClick={() => navigate("/")}
                  className="px-12 py-5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all"
               >
                  Back to Portfolio
               </button>
            </div>
          </div>

          {/* Sticky Sidebar Info - Behance Style */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-2 border-l border-slate-100 bg-white">
            <div className="sticky top-20 p-10 space-y-12">
               <div className="space-y-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Timeline</p>
                     <p className="font-bold text-sm">{work.year}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Discipline</p>
                     <p className="font-bold text-sm">{work.cat}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary">Result</p>
                     <p className="font-special-serif text-xl italic leading-tight">{work.result}</p>
                  </div>
               </div>

               <div className="h-px bg-slate-100" />

               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="size-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">RW</div>
                     <div>
                        <p className="text-xs font-bold">Rizki Wiratama</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Creator</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors">
                     Follow
                  </button>
               </div>

               <div className="pt-20">
                  <div className="flex items-center gap-8 text-slate-300">
                     <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">1.2k</p>
                        <p className="text-[9px] uppercase font-black tracking-widest">Views</p>
                     </div>
                     <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">458</p>
                        <p className="text-[9px] uppercase font-black tracking-widest">Appreciations</p>
                     </div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Meta Info (at bottom) */}
      <div className="md:hidden p-8 bg-white border-t border-slate-100 space-y-8">
         <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Timeline</p>
               <p className="font-bold">{work.year}</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Discipline</p>
               <p className="font-bold">{work.cat}</p>
            </div>
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Result</p>
            <p className="font-special-serif text-2xl italic leading-tight">{work.result}</p>
         </div>
      </div>

      {/* Footer */}
      <footer className="py-20 px-8 text-center bg-white border-t border-slate-100">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Rizki Wiratama · Creative Dossier 2026</p>
      </footer>
    </div>
  );
};

export default PortfolioDetail;
