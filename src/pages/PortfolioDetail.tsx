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
      <header className="pt-32 pb-16 px-8 md:px-12 max-w-7xl mx-auto text-center space-y-12">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="space-y-8"
        >
           <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em]">
             {work.cat}
           </div>
           <h1 className="font-special-serif text-6xl md:text-[12rem] leading-[0.8] tracking-tighter text-slate-900">
             {work.title}
           </h1>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
           className="relative aspect-[21/9] rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl border border-white"
        >
           <img src={getOptimizedUrl(work.img, 'hero')} className="w-full h-full object-cover" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
      </header>

      {/* Meta Info Bar */}
      <section className="max-w-7xl mx-auto px-8 md:px-12 mb-20 md:mb-32">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Timeline</p>
               <p className="font-bold text-lg">{work.year}</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Discipline</p>
               <p className="font-bold text-lg">{work.cat}</p>
            </div>
            <div className="col-span-2 space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-primary">Key Result</p>
               <p className="font-special-serif text-2xl md:text-3xl text-slate-900 leading-tight italic">{work.result}</p>
            </div>
         </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 md:px-12 pb-32">
         <div className="max-w-5xl mx-auto space-y-24 md:space-y-40">
            {Array.isArray(work.content_blocks) && work.content_blocks.length > 0 ? (
               work.content_blocks.map((block: any, i: number) => (
                 <motion.div
                   key={block.id || i}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-10%" }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   className="w-full"
                 >
                   {block.type === 'text' && (
                     <div className={cn(
                       "mx-auto",
                       block.style === 'quote' ? "max-w-4xl" : "max-w-3xl"
                     )}>
                       {block.style === 'heading' ? (
                         <h2 className="font-special-serif text-5xl md:text-[5rem] text-slate-900 leading-none mb-12 tracking-tighter">{block.content}</h2>
                       ) : block.style === 'quote' ? (
                         <div className="space-y-6 my-24">
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                               <ArrowUpRight className="size-6 text-primary rotate-45" />
                            </div>
                            <p className="font-special-serif text-4xl md:text-7xl italic text-slate-900 leading-[1.1] tracking-tight">
                              "{block.content}"
                            </p>
                         </div>
                       ) : (
                         <p className="text-xl md:text-3xl font-light text-slate-500 leading-relaxed font-sans">
                           {block.content}
                         </p>
                       )}
                     </div>
                   )}

                   {block.type === 'image' && (
                     <div className="w-full rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] bg-slate-50 border border-slate-100">
                       <img src={getOptimizedUrl(block.content, 'gallery')} className="w-full h-auto object-contain" alt="" />
                     </div>
                   )}

                   {block.type === 'grid' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                       {Array.isArray(block.urls) && block.urls.map((url: string, j: number) => (
                         <div 
                           key={j} 
                           className={cn(
                             "rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-xl bg-slate-50 border border-slate-100",
                             j % 2 !== 0 ? "md:translate-y-20" : ""
                           )}
                         >
                           <img src={getOptimizedUrl(url, 'gallery')} className="w-full h-auto object-cover" alt="" />
                         </div>
                       ))}
                     </div>
                   )}
                 </motion.div>
               ))
            ) : (
               <div className="space-y-32">
                  <div className="max-w-3xl mx-auto space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                           <Target className="size-6 text-primary" />
                        </div>
                        <h2 className="font-special-serif text-4xl md:text-6xl">The Mission</h2>
                     </div>
                     <p className="text-2xl md:text-4xl font-light text-slate-500 leading-tight">
                        {work.problem}. Our goal was to establish a new benchmark for premium brand interaction in the 2026 market.
                     </p>
                  </div>

                  {Array.isArray(work.gallery) && work.gallery.length > 0 && (
                    <div className="space-y-12 md:space-y-24">
                      {work.gallery.map((imgUrl: string, idx: number) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="w-full rounded-[3rem] md:rounded-[5rem] overflow-hidden bg-slate-100 shadow-2xl"
                        >
                          <img 
                            src={getOptimizedUrl(imgUrl, 'gallery')} 
                            className="w-full h-auto object-cover" 
                            alt={`${work.title} - view ${idx + 1}`} 
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
               </div>
            )}

            {/* CTA Section */}
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="pt-20 text-center space-y-12"
            >
               <div className="h-px bg-slate-100 w-full" />
               <div className="space-y-6">
                  <h3 className="font-special-serif text-4xl md:text-7xl">Ready to craft your story?</h3>
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center gap-6 px-12 py-6 bg-slate-900 rounded-full text-white group hover:bg-primary transition-colors"
                  >
                     <span className="font-bold text-lg">Work with Rizki</span>
                     <div className="size-10 rounded-full border border-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                        <ArrowUpRight className="size-5" />
                     </div>
                  </motion.a>
               </div>
            </motion.div>
         </div>
      </main>

      {/* Footer */}
      <footer className="py-20 px-8 text-center bg-white border-t border-slate-100">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Rizki Wiratama · Creative Dossier 2026</p>
      </footer>
    </div>
  );
};

export default PortfolioDetail;
