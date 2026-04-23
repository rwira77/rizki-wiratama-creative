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
  Info,
  Star,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const ADMIN_CATEGORIES = [
  { id: "Branding", label: "Branding" },
  { id: "Social Media", label: "Social Media" },
  { id: "Photography", label: "Photography" },
  { id: "Videography", label: "Videography" },
  { id: "Graphic Design", label: "Graphic Design" },
  { id: "Campaign & Event", label: "Campaign & Event" }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [works, setWorks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newProject, setNewProject] = useState({
    title: "",
    cat: "Branding",
    img: "",
    problem: "",
    result: "",
    year: new Date().getFullYear().toString(),
    hasDetail: false,
    block_gap: 80,
    content_blocks: [] as any[]
  });

  const fetchWorks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        console.error('Supabase Error:', error);
        setWorks([]);
      } else {
        setWorks(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    // Get only projects in the current selected category
    const filteredWorks = works.filter(w => selectedCategory === 'all' || w.cat === selectedCategory);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= filteredWorks.length) return;

    // Create a copy and swap
    const newFiltered = [...filteredWorks];
    [newFiltered[index], newFiltered[targetIndex]] = [newFiltered[targetIndex], newFiltered[index]];

    // Merge back with works from other categories
    const otherWorks = works.filter(w => selectedCategory !== 'all' && w.cat !== selectedCategory);
    
    // Update state
    if (selectedCategory === 'all') {
      setWorks(newFiltered);
    } else {
      // Advanced merging: preserve the positions of other categories
      const updatedWorks = [...works];
      const categoryIndices = works.map((w, i) => w.cat === selectedCategory ? i : -1).filter(i => i !== -1);
      
      categoryIndices.forEach((originalIdx, i) => {
        updatedWorks[originalIdx] = newFiltered[i];
      });
      setWorks(updatedWorks);
    }
    toast.success("Order changed! Click 'Save Order' to persist.");
  };

  const saveOrder = async () => {
    setIsLoading(true);
    try {
      const promises = works.map((w, index) => 
        supabase.from('works').update({ order_index: index }).eq('id', w.id)
      );
      await Promise.all(promises);
      toast.success("Order saved to database!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save order.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Session ended");
    navigate("/");
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      fetchWorks();
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-8 sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Admin Nexus</h2>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("portfolio")}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all",
                activeTab === "portfolio" ? "bg-slate-900 text-white shadow-xl scale-105" : "text-slate-400 hover:bg-slate-50"
              )}
            >
               <LayoutDashboard className="size-4" /> Master Portfolio
            </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-auto w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50 transition-all"
        >
           <LogOut className="size-4" /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="flex items-center justify-between mb-12">
          <h1 className="font-special-serif text-5xl text-slate-900">
            {activeTab === "portfolio" ? "Portfolio" : "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
             <button 
               onClick={saveOrder}
               disabled={isLoading}
               className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
             >
               <Save className="size-4" /> Save Order
             </button>
             <button 
               onClick={() => {
                 setIsEditing(false);
                 setIsModalOpen(true);
               }}
               className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg"
             >
               <Plus className="size-4" /> New Project
             </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="size-10 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              <button 
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  selectedCategory === "all" ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                )}
              >
                All Projects
              </button>
              {ADMIN_CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    selectedCategory === cat.id ? "bg-primary text-white" : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-4">
              {works
                .filter(w => selectedCategory === 'all' || w.cat === selectedCategory)
                .map((work) => (
                <div 
                  key={work.id}
                  className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-6"
                >
                  <div className="size-16 rounded-2xl bg-slate-50 overflow-hidden">
                    <img src={work.img} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-special-serif text-xl">{work.title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">{work.cat} • {work.year}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCategory !== 'all' && (
                      <div className="flex items-center gap-1 mr-4">
                        <button 
                          onClick={() => moveProject(idx, 'up')}
                          disabled={idx === 0}
                          className="p-2 text-slate-300 hover:text-slate-900 disabled:opacity-20"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button 
                          onClick={() => moveProject(idx, 'down')}
                          disabled={idx === works.filter(w => w.cat === selectedCategory).length - 1}
                          className="p-2 text-slate-300 hover:text-slate-900 disabled:opacity-20"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                    )}
                    <button className="p-3 text-slate-300 hover:text-slate-900"><PenTool className="size-4" /></button>
                    <button className="p-3 text-slate-300 hover:text-red-500"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
