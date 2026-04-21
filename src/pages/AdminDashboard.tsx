import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  X,
  Save,
  PenTool,
  ExternalLink,
  Info
} from "lucide-react";
import { initialWorks, categories } from "@/components/Portfolio";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [works, setWorks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to fetch works from Supabase");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    toast.info("Session ended");
    navigate("/");
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("isAdminAuthenticated");
    if (!isAuth) {
      navigate("/admin/login");
      return;
    }
    fetchWorks();
  }, [navigate]);

  const toggleDetail = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('works')
        .update({ hasDetail: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      setWorks(works.map(w => 
        w.id === id ? { ...w, hasDetail: !currentStatus } : w
      ));
      toast.success("Visibility updated in Supabase");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Supabase");
    }
  };

  const deleteWork = async (id: string) => {
    if (confirm("Permanently delete this project from Supabase?")) {
      try {
        const { error } = await supabase
          .from('works')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setWorks(works.filter(w => w.id !== id));
        toast.error("Project deleted from Supabase");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const seedData = async () => {
    if (works.length > 0) {
      toast.info("Database already contains data");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('works')
        .insert(initialWorks);

      if (error) throw error;
      toast.success("Database seeded with initial works!");
      fetchWorks();
    } catch (error: any) {
      toast.error("Seed failed: " + error.message);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white border-r border-slate-100 p-10 flex flex-col justify-between fixed h-full z-20">
        <div className="space-y-12">
          <div className="flex items-center gap-4">
             <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl italic">
               R
             </div>
             <div>
                <h2 className="font-special-serif text-xl">Rizki OS</h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-300 font-black">Admin Panel</p>
             </div>
          </div>

          <nav className="space-y-2">
             <button 
               onClick={() => setActiveTab("portfolio")}
               className={cn(
                 "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all",
                 activeTab === "portfolio" ? "bg-slate-900 text-white shadow-xl scale-105" : "text-slate-400 hover:bg-slate-50"
               )}
             >
                <LayoutDashboard className="size-4" /> Portfolio Management
             </button>
             <button 
               onClick={() => setActiveTab("profile")}
               className={cn(
                 "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all",
                 activeTab === "profile" ? "bg-slate-900 text-white shadow-xl scale-105" : "text-slate-400 hover:bg-slate-50"
               )}
             >
                <FileText className="size-4" /> Personal Dossier
             </button>
             <button 
               onClick={() => navigate("/")}
               className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-slate-400 hover:bg-slate-50 transition-all"
             >
                <ExternalLink className="size-4" /> View Live Site
             </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50 transition-all"
        >
           <LogOut className="size-4" /> Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="ml-80 flex-1 p-12">
        <header className="flex items-center justify-between mb-12">
           <h1 className="font-special-serif text-5xl text-slate-900">
             {activeTab === "portfolio" ? "Master Portfolio" : "Profile Settings"}
           </h1>
           <div className="flex items-center gap-4">
             {activeTab === "portfolio" && works.length === 0 && (
               <button 
                 onClick={seedData}
                 className="bg-amber-100 text-amber-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-200 transition-colors"
               >
                 <Save className="size-4" /> Seed Database
               </button>
             )}
             {activeTab === "portfolio" && (
               <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg active:scale-95">
                 <Plus className="size-4" /> New Project
               </button>
             )}
           </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
             <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : activeTab === "portfolio" ? (
          <div className="grid gap-6">
             <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Info className="size-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-bold text-blue-900">Visibility Control</p>
                   <p className="text-sm text-blue-700/80 leading-relaxed">
                     Some projects only require a single image showcase. Toggle the <strong>Detail View</strong> switch to decide if a project should link to its case study page.
                   </p>
                </div>
             </div>

             <AnimatePresence>
               {works.map((work) => (
                 <motion.div
                   key={work.id}
                   layout
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white border border-slate-100 rounded-[2rem] p-8 flex items-center gap-10 hover:shadow-md transition-shadow group"
                 >
                    <div className="size-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                       <img src={work.img} className="w-full h-full object-cover" alt="" />
                    </div>

                    <div className="flex-1 space-y-2">
                       <div className="flex items-center gap-3">
                          <h3 className="font-special-serif text-2xl text-slate-900">{work.title}</h3>
                          <span className="px-3 py-1 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-full border border-slate-100">
                             {work.cat}
                          </span>
                       </div>
                       <p className="text-slate-400 text-sm font-medium line-clamp-1">{work.problem}</p>
                    </div>

                    <div className="flex items-center gap-6 pr-4 border-r border-slate-100">
                       <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Detail Page</p>
                          <p className={cn("text-xs font-bold", work.hasDetail ? "text-emerald-500" : "text-amber-500")}>
                             {work.hasDetail ? "Enabled" : "Disabled"}
                          </p>
                       </div>
                       <button 
                         onClick={() => toggleDetail(work.id, work.hasDetail)}
                         className={cn(
                           "relative w-12 h-6 rounded-full transition-colors",
                           work.hasDetail ? "bg-emerald-400" : "bg-slate-200"
                         )}
                       >
                          <motion.div 
                            animate={{ x: work.hasDetail ? 24 : 4 }}
                            className="absolute top-1 size-4 bg-white rounded-full shadow-sm"
                          />
                       </button>
                    </div>

                    <div className="flex items-center gap-3">
                       <button className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all">
                          <PenTool className="size-4" />
                       </button>
                       <button 
                         onClick={() => deleteWork(work.id)}
                         className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                       >
                          <Trash2 className="size-4" />
                       </button>
                    </div>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        ) : (
          <div className="max-w-2xl bg-white border border-slate-100 rounded-[3rem] p-12 space-y-12">
             <div className="space-y-8">
                <div className="grid gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Name</label>
                      <input type="text" defaultValue="Rizki Wiratama" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Title</label>
                      <input type="text" defaultValue="Creative Strategist & Designer" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900" />
                   </div>
                </div>
                
                <button className="bg-slate-900 text-white w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-colors">
                  <Save className="size-4" /> Update Dossier
                </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
