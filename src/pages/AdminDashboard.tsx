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
  Folder
} from "lucide-react";
import { SECTIONS } from "@/config/sections";
import { initialWorks, categories } from "@/components/Portfolio";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [works, setWorks] = useState<any[]>([]);
  const [desktopLinks, setDesktopLinks] = useState<any[]>([]);
  const [sectionSettings, setSectionSettings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newProject, setNewProject] = useState({
    title: "",
    cat: "Branding",
    img: "",
    problem: "",
    result: "",
    year: new Date().getFullYear().toString(),
    hasDetail: false
  });

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    icon_name: "Star",
    icon_url: "",
    color: "text-blue-500",
    top: "20%",
    left: "20%"
  });

  const fetchWorks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setWorks(data || []);
    } catch (error: any) {
      console.error('Supabase Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDesktopLinks = async () => {
    try {
      const { data, error } = await supabase.from('desktop_links').select('*');
      if (error) throw error;
      setDesktopLinks(data || []);
    } catch (error: any) {
      console.error('Supabase Error:', error);
    }
  };

  const fetchSectionSettings = async () => {
    try {
      const { data, error } = await supabase.from('section_settings').select('*');
      if (error) throw error;
      setSectionSettings(data || []);
    } catch (error: any) {
      console.error('Supabase Error:', error);
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
      fetchDesktopLinks();
      fetchSectionSettings();
    };
    
    checkSession();
  }, [navigate]);

  const deleteLink = async (id: string) => {
    if (confirm("Delete this desktop shortcut?")) {
      try {
        const { error } = await supabase.from('desktop_links').delete().eq('id', id);
        if (error) throw error;
        setDesktopLinks(desktopLinks.filter(l => l.id !== id));
        toast.error("Shortcut deleted");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleOpenEditSection = (id: string) => {
    const existing = sectionSettings.find(s => s.id === id);
    setNewLink({
      title: id.toUpperCase(),
      url: "#",
      icon_name: "Folder",
      icon_url: "",
      color: "text-blue-500",
      top: existing?.top || "10%",
      left: existing?.left || "10%"
    });
    setEditingId(id);
    setIsEditing(true);
    setIsLinkModalOpen(true);
  };

  const updateSectionPosition = async () => {
    try {
      const { error } = await supabase
        .from('section_settings')
        .upsert({ 
          id: editingId, 
          top: newLink.top, 
          left: newLink.left 
        });

      if (error) throw error;
      toast.success("Folder position updated!");
      setIsLinkModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
      fetchSectionSettings();
    } catch (error: any) {
      toast.error("Update failed");
    }
  };

  const handleOpenEditLink = (link: any) => {
    setNewLink({
      title: link.title,
      url: link.url,
      icon_name: link.icon_name || "Star",
      icon_url: link.icon_url || "",
      color: link.color || "text-blue-500",
      top: link.top,
      left: link.left
    });
    setEditingId(link.id);
    setIsEditing(true);
    setIsLinkModalOpen(true);
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      const isSection = SECTIONS.some(s => s.id === editingId);
      if (isSection) {
        await updateSectionPosition();
      } else {
        await handleUpdateLink();
      }
    } else {
      await handleAddLink(e);
    }
  };

  const handleUpdateLink = async () => {
    try {
      const { error } = await supabase
        .from('desktop_links')
        .update(newLink)
        .eq('id', editingId);

      if (error) throw error;
      
      toast.success("Shortcut updated!");
      setIsLinkModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
      fetchDesktopLinks();
    } catch (error: any) {
      toast.error("Update failed: " + error.message);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const randomTop = `${Math.floor(Math.random() * 60) + 15}%`;
    const randomLeft = `${Math.floor(Math.random() * 70) + 10}%`;
    
    try {
      const linkData = { 
        ...newLink, 
        top: newLink.top || randomTop, 
        left: newLink.left || randomLeft 
      };

      const { data, error } = await supabase
        .from('desktop_links')
        .insert([linkData])
        .select();

      if (error) throw error;
      
      toast.success("Shortcut added to desktop!");
      setDesktopLinks([...desktopLinks, data[0]]);
      setIsLinkModalOpen(false);
      setNewLink({ title: "", url: "", icon_name: "Star", icon_url: "", color: "text-blue-500", top: "", left: "" });
    } catch (error: any) {
      toast.error("Failed to add: " + error.message);
    }
  };

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

  const handleOpenEdit = (work: any) => {
    setNewProject({
      title: work.title,
      cat: work.cat,
      img: work.img,
      problem: work.problem,
      result: work.result,
      year: work.year,
      hasDetail: work.hasDetail
    });
    setEditingId(work.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
       await handleUpdateProject();
    } else {
       await handleAddProject();
    }
  };

  const handleUpdateProject = async () => {
    try {
      const { error } = await supabase
        .from('works')
        .update(newProject)
        .eq('id', editingId);

      if (error) throw error;
      
      toast.success("Project updated successfully!");
      closeModal();
      fetchWorks();
    } catch (error: any) {
      toast.error("Update failed: " + error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setNewProject({
      title: "",
      cat: "Branding",
      img: "",
      problem: "",
      result: "",
      year: new Date().getFullYear().toString(),
      hasDetail: false
    });
  };

  const handleAddProject = async () => {
    const id = newProject.title.toLowerCase().replace(/\s+/g, '-');
    
    try {
      const { error } = await supabase
        .from('works')
        .insert([{ ...newProject, id }]);

      if (error) throw error;
      
      toast.success("Project added successfully!");
      closeModal();
      fetchWorks();
    } catch (error: any) {
      toast.error("Failed to add project: " + error.message);
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
               onClick={() => setActiveTab("desktop")}
               className={cn(
                 "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all",
                 activeTab === "desktop" ? "bg-slate-900 text-white shadow-xl scale-105" : "text-slate-400 hover:bg-slate-50"
               )}
             >
                <PenTool className="size-4" /> Desktop Ecosystem
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
             {activeTab === "portfolio" ? "Master Portfolio" : activeTab === "desktop" ? "Desktop Ecosystem" : "Profile Settings"}
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
               <button 
                 onClick={() => {
                   setIsEditing(false);
                   setIsModalOpen(true);
                 }}
                 className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg active:scale-95"
               >
                 <Plus className="size-4" /> New Project
               </button>
             )}
             {activeTab === "desktop" && (
               <button 
                 onClick={() => setIsLinkModalOpen(true)}
                 className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-lg active:scale-95"
               >
                 <Plus className="size-4" /> Add Shortcut
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
                       <button 
                         onClick={() => handleOpenEdit(work)}
                         className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all"
                       >
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
        ) : activeTab === "desktop" ? (
          <div className="space-y-12">
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-4">
                Core App Folders <div className="flex-1 h-px bg-slate-100" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SECTIONS.map((section) => {
                  const setting = sectionSettings.find(s => s.id === section.id);
                  return (
                    <div key={section.id} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-xl bg-slate-900 shadow-sm")}>
                             <Folder className="size-5 text-white" />
                          </div>
                          <div>
                             <p className="font-bold text-slate-900 text-sm">{section.title}</p>
                             <p className="text-[10px] text-slate-400 font-mono italic">Pos: {setting?.top || "Default"}, {setting?.left || "Default"}</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleOpenEditSection(section.id)}
                         className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-xl shadow-sm transition-all"
                       >
                          <PenTool className="size-4" />
                       </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-4">
                Ecosystem Shortcuts <div className="flex-1 h-px bg-slate-100" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {desktopLinks.map((link) => (
                   <motion.div
                     key={link.id}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl transition-all group"
                   >
                      <div className="flex items-start justify-between mb-6">
                         <div className={cn("p-4 rounded-2xl bg-slate-50 text-2xl", link.color)}>
                            <Star className="size-6" />
                         </div>
                         <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleOpenEditLink(link)}
                              className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                            >
                              <PenTool className="size-4" />
                            </button>
                            <button 
                              onClick={() => deleteLink(link.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="size-4" />
                            </button>
                         </div>
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-900 mb-1">{link.title}</h3>
                         <p className="text-xs text-slate-400 truncate font-mono mb-4">{link.url}</p>
                         <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">Pos: {link.top}, {link.left}</span>
                         </div>
                      </div>
                   </motion.div>
                 ))}
                 {desktopLinks.length === 0 && (
                   <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                      <PenTool className="size-12 text-slate-200 mx-auto" />
                      <p className="text-slate-400 font-medium">Your desktop is empty. Add icons like IG or Behance!</p>
                   </div>
                 )}
              </div>
            </section>
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

      {/* Add Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-special-serif text-3xl">{isEditing ? "Modify Project" : "Launch New Project"}</h2>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-300 mt-1">
                    {isEditing ? `Editing ID: ${editingId}` : "Project Deployment Form"}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  <X className="size-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Project Title</label>
                    <input 
                      required
                      type="text" 
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      placeholder="e.g. Maison Editorial"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                    <select 
                      value={newProject.cat}
                      onChange={(e) => setNewProject({...newProject, cat: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Banner Image URL</label>
                  <input 
                    required
                    type="text" 
                    value={newProject.img}
                    onChange={(e) => setNewProject({...newProject, img: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">The Problem (Challenge)</label>
                    <textarea 
                      required
                      value={newProject.problem}
                      onChange={(e) => setNewProject({...newProject, problem: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">The Result (Metric)</label>
                    <textarea 
                      required
                      value={newProject.result}
                      onChange={(e) => setNewProject({...newProject, result: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem]">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "size-10 rounded-xl flex items-center justify-center transition-colors",
                      newProject.hasDetail ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                    )}>
                      <Check className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Enable Case Study Detail</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Requires custom case study data</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setNewProject({...newProject, hasDetail: !newProject.hasDetail})}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      newProject.hasDetail ? "bg-emerald-400" : "bg-slate-200"
                    )}
                  >
                    <motion.div 
                      animate={{ x: newProject.hasDetail ? 24 : 4 }}
                      className="absolute top-1 size-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-4 border border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
                  >
                    {isEditing ? "Update Project" : "Publish Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Shortcut Modal */}
        {isLinkModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsLinkModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-special-serif text-3xl">{isEditing ? "Modify Shortcut" : "Add Desktop Shortcut"}</h2>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-300 mt-1">
                    {isEditing ? `Editing ID: ${editingId}` : "Deploy External Link"}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsLinkModalOpen(false);
                    setIsEditing(false);
                    setEditingId(null);
                  }} 
                  className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  <X className="size-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleLinkSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Display Name</label>
                  <input 
                    required
                    type="text" 
                    value={newLink.title}
                    onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="e.g. My Instagram"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">External URL</label>
                    <input 
                      required
                      type="text" 
                      value={newLink.url}
                      onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      placeholder="https://social.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Icon Image URL (Optional)</label>
                    <input 
                      type="text" 
                      value={newLink.icon_url}
                      onChange={(e) => setNewLink({...newLink, icon_url: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      placeholder="https://site.com/icon.png"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Accent Color</label>
                    <select 
                      value={newLink.color}
                      onChange={(e) => setNewLink({...newLink, color: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none"
                    >
                      <option value="text-pink-500">Pink (Instagram)</option>
                      <option value="text-black">Black (TikTok/Medium)</option>
                      <option value="text-blue-500">Blue (LinkedIn)</option>
                      <option value="text-orange-500">Orange (Behance)</option>
                      <option value="text-purple-600">Purple (Figma)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Top (%)</label>
                      <input 
                        type="text" 
                        value={newLink.top}
                        onChange={(e) => setNewLink({...newLink, top: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        placeholder="e.g. 25%"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Left (%)</label>
                      <input 
                        type="text" 
                        value={newLink.left}
                        onChange={(e) => setNewLink({...newLink, left: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        placeholder="e.g. 10%"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl">
                    {isEditing ? "Save Changes" : "Add to Desktop"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
