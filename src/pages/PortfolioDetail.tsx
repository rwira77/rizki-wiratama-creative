import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowUpRight, Calendar, Tag, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

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
      <header className="pt-32 pb-20 px-8 md:px-12 max-w-7xl mx-auto space-y-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6"
        >
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
             {work.cat}
           </div>
           <h1 className="font-special-serif text-6xl md:text-9xl leading-[0.9] tracking-tighter">
             {work.title}
           </h1>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
           className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border border-white"
        >
           <img src={work.img} className="w-full h-full object-cover" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </header>

      {/* Content Grid */}
      <main className="px-8 md:px-12 max-w-7xl mx-auto grid md:grid-cols-12 gap-16 pb-32">
        <aside className="md:col-span-4 space-y-12">
           <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                   <Calendar className="size-3" /> Timeline
                 </p>
                 <p className="font-bold text-slate-900">{work.year}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                   <Tag className="size-3" /> Discipline
                 </p>
                 <p className="font-bold text-slate-900">{work.cat}</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                   <BarChart3 className="size-3" /> Key Results
                 </p>
                 <p className="text-2xl font-special-serif text-slate-900 leading-tight italic">{work.result}</p>
              </div>
           </div>

           <motion.a
             href="/"
             className="flex items-center justify-between p-8 bg-primary rounded-[2rem] text-white group"
           >
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Ready to start?</p>
                 <p className="font-special-serif text-2xl group-hover:underline">Contact Rizki</p>
              </div>
              <div className="size-12 rounded-full border border-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="size-5" />
              </div>
           </motion.a>
        </aside>

        <section className="md:col-span-8 space-y-16">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="size-4 text-primary" />
                 </div>
                 <h2 className="font-special-serif text-3xl">The Mission</h2>
              </div>
              <p className="text-xl md:text-2xl font-light text-slate-500 leading-relaxed">
                 {work.problem}. Our goal was to redefine the visual narrative and establish a new benchmark for premium brand interaction in the 2026 market.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="aspect-[4/5] rounded-[2rem] bg-slate-200 overflow-hidden">
                <img src={work.img} className="w-full h-full object-cover grayscale-[0.5]" alt="" />
              </div>
              <div className="aspect-[4/5] rounded-[2rem] bg-slate-200 overflow-hidden mt-12">
                <img src={work.img} className="w-full h-full object-cover" alt="" />
              </div>
           </div>

           <div className="space-y-8">
              <h3 className="font-special-serif text-3xl italic">"Visual empathy is the core of every design decision we made on this project."</h3>
              <div className="h-px bg-slate-100" />
              <p className="text-slate-500 max-w-xl">
                 Every pixel was considered for its emotional impact and commercial viability. This case study represents our commitment to blending cinematic aesthetics with conversion-driven design.
              </p>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-8 text-center bg-white border-t border-slate-100">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Rizki Wiratama · Creative Dossier 2026</p>
      </footer>
    </div>
  );
};

export default PortfolioDetail;
