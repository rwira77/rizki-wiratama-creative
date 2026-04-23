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
  Folder,
  Type,
  AlignLeft,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  GripVertical
} from "lucide-react";
import { SECTIONS } from "@/config/sections";
import { initialWorks } from "@/components/Portfolio";
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
  const [desktopLinks, setDesktopLinks] = useState<any[]>([]);
  const [sectionSettings, setSectionSettings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
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

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    icon_name: "Star",
    icon_url: "",
    color: "text-blue-500",
    top: "20%",
    left: "20%"
  });

  const [uploading, setUploading] = useState(false);
  const [cloudinarySettings, setCloudinarySettings] = useState({
    cloudName: localStorage.getItem('cloudinary_cloud_name') || "dpnkhbgdc",
    uploadPreset: localStorage.getItem('cloudinary_upload_preset') || "portfolio_upload"
  });

  const handleCloudinaryUpload = async (file: File): Promise<string | null> => {
    if (!cloudinarySettings.cloudName || !cloudinarySettings.uploadPreset) {
      toast.error("Please configure Cloudinary settings in the Profile tab first");
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinarySettings.uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinarySettings.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        toast.success("Image uploaded successfully!");
        return data.secure_url;
      }
      throw new Error(data.error?.message || "Upload failed");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const fetchWorks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        console.error('Supabase Error:', error);
        setWorks([]); // Fallback to empty array
        return;
      }
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

  const isSectionEditing = SECTIONS.some(s => s.id === editingId);

  const handleOpenEditSection = (id: string) => {
    const existing = sectionSettings.find(s => s.id === id);
    const lowercaseId = id.toLowerCase();
    setNewLink({
      title: id.charAt(0).toUpperCase() + id.slice(1),
      url: "#",
      icon_name: "Folder",
      icon_url: "",
      color: "text-blue-500",
      top: existing?.top || "10%",
      left: existing?.left || "10%"
    });
    setEditingId(lowercaseId);
    setIsEditing(true);
    setIsLinkModalOpen(true);
  };

  const updateSectionPosition = async () => {
    try {
      const payload = { 
        id: editingId as string, 
        top: newLink.top, 
        left: newLink.left 
      };
      
      const { error } = await supabase
        .from('section_settings')
        .upsert(payload);

      if (error) throw error;
      
      // Sync local state immediately
      setSectionSettings(prev => {
        const other = prev.filter(s => s.id !== editingId);
        return [...other, payload];
      });

      toast.success("Folder position updated!");
      setIsLinkModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error: any) {
      toast.error("Update failed: " + (error.message || "Check your table settings"));
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
      if (isSectionEditing) {
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
      
      // Sync local state immediately
      setDesktopLinks(prev => prev.map(l => 
        l.id === editingId ? { ...l, ...newLink } : l
      ));

      toast.success("Shortcut updated!");
      setIsLinkModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
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
    if (!work) return;
    
    // Ensure all content blocks have unique IDs for legacy data
    const sanitizedBlocks = (Array.isArray(work.content_blocks) ? work.content_blocks : []).map((b: any) => ({
      ...b,
      id: b?.id || Math.random().toString(36).substr(2, 9)
    }));

    setNewProject({
      title: work.title || "",
      cat: work.cat || "Branding",
      img: work.img || "",
      problem: work.problem || "",
      result: work.result || "",
      year: work.year || new Date().getFullYear().toString(),
      hasDetail: !!work.hasDetail,
      block_gap: typeof work.block_gap === 'number' ? work.block_gap : 80,
      content_blocks: sanitizedBlocks
    });
    setEditingId(work.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    // Get only projects in the current selected category
    const filteredWorks = works.filter(w => selectedCategory === 'all' || w.cat === selectedCategory);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= filteredWorks.length) return;

    // Create a copy of the filtered works and swap
    const newFiltered = [...filteredWorks];
    [newFiltered[index], newFiltered[targetIndex]] = [newFiltered[targetIndex], newFiltered[index]];

    // Merge back with works from other categories to maintain global state
    const otherWorks = works.filter(w => selectedCategory !== 'all' && w.cat !== selectedCategory);
    setWorks([...otherWorks, ...newFiltered]);
    toast.success("Order changed! Don't forget to save your projects to persist changes.");
  };

  const handleReorder = (newOrder: any[]) => {
    if (selectedCategory === 'all') {
      setWorks(newOrder);
      return;
    }

    // Advanced merging: preserve the positions of other categories
    const updatedWorks = [...works];
    const categoryIndices = works.map((w, i) => w.cat === selectedCategory ? i : -1).filter(i => i !== -1);
    
    categoryIndices.forEach((originalIdx, i) => {
      updatedWorks[originalIdx] = newOrder[i];
    });
    
    setWorks(updatedWorks);
  };

  const saveOrder = async () => {
    setIsLoading(true);
    try {
      // Update each project with its new order_index based on its position in the array
      const promises = works.map((w, index) => 
        supabase.from('works').update({ order_index: index }).eq('id', w.id)
      );
      
      await Promise.all(promises);
      toast.success("Project order saved permanently!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save order. Make sure 'order_index' column exists in Supabase.");
    } finally {
      setIsLoading(false);
    }
  };

  const addBlock = (type: 'text' | 'image' | 'grid') => {
    const newBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? 'New text block...' : '',
      urls: type === 'grid' ? [] : undefined,
      style: type === 'text' ? 'paragraph' : undefined
    };
    setNewProject(prev => ({
      ...prev,
      content_blocks: [...(Array.isArray(prev.content_blocks) ? prev.content_blocks : []), newBlock]
    }));
  };

  const updateBlock = (id: string, data: any) => {
    setNewProject(prev => ({
      ...prev,
      content_blocks: (Array.isArray(prev.content_blocks) ? prev.content_blocks : []).map(b => 
        (b && b.id === id) ? { ...b, ...data } : b
      )
    }));
  };

  const removeBlock = (id: string) => {
    setNewProject(prev => ({
      ...prev,
      content_blocks: (Array.isArray(prev.content_blocks) ? prev.content_blocks : []).filter(b => b && b.id !== id)
    }));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const blocks = [...newProject.content_blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    setNewProject(prev => ({ ...prev, content_blocks: blocks }));
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
      const payload = {
        ...newProject
      };

      const { error } = await supabase
        .from('works')
        .update(payload)
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
      hasDetail: false,
      block_gap: 80,
      content_blocks: []
    });
  };

  const handleAddProject = async () => {
    const id = newProject.title.toLowerCase().replace(/\s+/g, '-');
    
    try {
      const payload = {
        ...newProject,
        id
      };

      const { error } = await supabase
        .from('works')
        .insert([payload]);

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
                <div className="flex items-center gap-2">
                  <button 
                    onClick={saveOrder}
                    disabled={isLoading}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Save className="size-4" /> Save Order
                  </button>
                  <button 
                    onClick={handleOpenCreate}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="size-4" /> New Project
                  </button>
                </div>
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
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4 mb-2">
               <div className="p-2 bg-blue-100 rounded-xl">
                 <Info className="size-4 text-blue-600" />
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-bold text-blue-900">Portfolio Organization</p>
                  <p className="text-sm text-blue-700/80 leading-relaxed">
                    Select a category to enable custom reordering. Grouping projects by specialty makes your work easier to navigate.
                  </p>
               </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
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

            <div className="space-y-4">
              {works.filter(w => selectedCategory === 'all' || w.cat === selectedCategory).map((work, idx) => (
                <motion.div 
                  key={work.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-100 rounded-[2rem] p-4 shadow-sm hover:shadow-md transition-shadow group flex items-center gap-6"
                >
                  {/* Compact Thumbnail */}
                  <div className="relative size-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                    <img src={work.img} alt={work.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Project Info - Expanded */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-special-serif text-xl text-slate-900 truncate">{work.title}</h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black uppercase tracking-widest text-slate-400 rounded-full border border-slate-200">
                        {work.cat}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <div className={cn("size-1.5 rounded-full", work.hasDetail ? "bg-emerald-500" : "bg-amber-500")} />
                        {work.hasDetail ? "Case Study" : "Quick View"}
                      </div>
                      <span>•</span>
                      <span>{work.year}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pr-2">
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
                    <button 
                      onClick={() => handleOpenEdit(work)}
                      className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <PenTool className="size-4" />
                    </button>
                    <button 
                      onClick={() => deleteWork(work.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
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
                
                <div className="pt-8 border-t border-slate-50 space-y-6">
                   <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="size-4 text-primary" />
                      <h3 className="text-sm font-bold">Cloudinary Configuration</h3>
                   </div>
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cloud Name</label>
                         <input 
                            type="text" 
                            value={cloudinarySettings.cloudName}
                            onChange={(e) => {
                               setCloudinarySettings({...cloudinarySettings, cloudName: e.target.value});
                               localStorage.setItem('cloudinary_cloud_name', e.target.value);
                            }}
                            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" 
                            placeholder="e.g. dxyz1234"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Upload Preset (Unsigned)</label>
                         <input 
                            type="text" 
                            value={cloudinarySettings.uploadPreset}
                            onChange={(e) => {
                               setCloudinarySettings({...cloudinarySettings, uploadPreset: e.target.value});
                               localStorage.setItem('cloudinary_upload_preset', e.target.value);
                            }}
                            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm" 
                            placeholder="e.g. my_preset"
                         />
                      </div>
                   </div>
                   <p className="text-[10px] text-slate-400 leading-relaxed italic">
                      * Settings are saved locally in your browser for security.
                   </p>
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
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
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
                      {ADMIN_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        required
                        type="text" 
                        value={newProject.img}
                        onChange={(e) => setNewProject({...newProject, img: e.target.value})}
                        className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        placeholder="https://images.unsplash.com/..."
                      />
                      <label className="shrink-0 bg-white border border-slate-100 p-4 rounded-2xl cursor-pointer hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center">
                        <ImageIcon className="size-5" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleCloudinaryUpload(file);
                              if (url) setNewProject({...newProject, img: url});
                            }
                          }}
                        />
                      </label>
                    </div>
                  <p className="text-[9px] font-bold text-blue-400 mt-1 ml-4 uppercase tracking-widest">
                    Tip: Cloudinary URLs are automatically optimized for performance.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Release Year</label>
                    <input 
                      type="text" 
                      value={newProject.year}
                      onChange={(e) => setNewProject({...newProject, year: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Block Vertical Gap (px)</label>
                    <input 
                      type="number" 
                      value={newProject.block_gap}
                      onChange={(e) => setNewProject({...newProject, block_gap: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
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

                {newProject.hasDetail && (
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Visual Case Study Builder</h3>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-bold transition-all">
                          <Type className="size-3" /> Add Text
                        </button>
                        <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-bold transition-all">
                          <ImageIcon className="size-3" /> Add Image
                        </button>
                        <button type="button" onClick={() => addBlock('grid')} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-bold transition-all">
                          <LayoutGrid className="size-3" /> Add Grid
                        </button>
                        <div className="h-6 w-px bg-slate-100 mx-1" />
                        <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                          {uploading ? (
                            <div className="size-3 border-2 border-current border-t-transparent animate-spin" />
                          ) : (
                            <ImageIcon className="size-3" />
                          )}
                          Bulk Upload
                          <input 
                            multiple
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            disabled={uploading}
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;
                              
                              // Sort by filename
                              const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
                              
                              toast.info(`Uploading ${files.length} images...`);
                              const uploadPromises = sortedFiles.map(file => handleCloudinaryUpload(file));
                              const results = await Promise.all(uploadPromises);
                              
                              const newBlocks = results
                                .filter((url): url is string => typeof url === 'string')
                                .map(url => ({
                                  id: Math.random().toString(36).substr(2, 9),
                                  type: 'image' as const,
                                  content: url
                                }));
                              
                              if (newBlocks.length > 0) {
                                setNewProject(prev => ({
                                  ...prev,
                                  content_blocks: [...(Array.isArray(prev.content_blocks) ? prev.content_blocks : []), ...newBlocks]
                                }));
                                toast.success(`Added ${newBlocks.length} images to case study!`);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {newProject.content_blocks.length === 0 && (
                        <div className="py-20 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                          <ImageIcon className="size-8 mb-4 opacity-20" />
                          <p className="text-xs font-bold uppercase tracking-widest">No content blocks yet</p>
                          <p className="text-[10px] opacity-60 text-center">Start building your story by adding blocks above</p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {Array.isArray(newProject.content_blocks) && newProject.content_blocks.map((block, idx) => {
                          if (!block || !block.id) return null;
                          return (
                            <div
                              key={`block-${block.id}`}
                              className="group relative bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "p-2 rounded-lg",
                                    block.type === 'text' ? "bg-amber-50 text-amber-500" : 
                                    block.type === 'image' ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
                                  )}>
                                    {block.type === 'text' ? <Type className="size-3" /> : 
                                     block.type === 'image' ? <ImageIcon className="size-3" /> : 
                                     <LayoutGrid className="size-3" />}
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">{block.type}</span>
                                    {block.type === 'text' && (
                                      <select 
                                        value={block.style || 'paragraph'}
                                        onChange={(e) => updateBlock(block.id, { style: e.target.value })}
                                        className="text-[9px] font-bold text-primary uppercase bg-transparent p-0 border-none focus:ring-0 cursor-pointer"
                                      >
                                        <option value="paragraph">Paragraph</option>
                                        <option value="heading">Heading</option>
                                        <option value="quote">Quote</option>
                                      </select>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-100 transition-opacity">
                                  <button type="button" onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="p-2 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg text-slate-400 disabled:opacity-10 transition-all"><ChevronUp className="size-3.5" /></button>
                                  <button type="button" onClick={() => moveBlock(idx, 'down')} disabled={idx === newProject.content_blocks.length - 1} className="p-2 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg text-slate-400 disabled:opacity-10 transition-all"><ChevronDown className="size-3.5" /></button>
                                  <div className="w-px h-4 bg-slate-100 mx-1" />
                                  <button type="button" onClick={() => removeBlock(block.id)} className="p-2 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-lg transition-all"><Trash2 className="size-3.5" /></button>
                                </div>
                              </div>

                              {block.type === 'text' && (
                                <textarea
                                  value={block.content || ""}
                                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                  className={cn(
                                    "w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-primary/10 transition-all min-h-[100px]",
                                    block.style === 'heading' ? "text-lg font-special-serif" : "text-xs"
                                  )}
                                  placeholder="Content here..."
                                />
                              )}

                              {block.type === 'image' && (
                                <div className="space-y-4">
                                  {typeof block.content === 'string' && block.content.trim() !== "" && (
                                    <div className="relative group/thumb w-32 aspect-video rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                                      <img 
                                        src={block.content} 
                                        className="w-full h-full object-cover" 
                                        alt="Preview" 
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f8fafc/cbd5e1?text=Invalid+Image';
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            try {
                                              window.open(block.content, '_blank');
                                            } catch (e) {
                                              toast.error("Invalid URL");
                                            }
                                          }}
                                          className="p-1.5 bg-white rounded-lg text-slate-900"
                                        >
                                          <ExternalLink className="size-3" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={block.content || ""}
                                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                      className="flex-1 bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                                      placeholder="Image URL..."
                                    />
                                    <label className="shrink-0 bg-white border border-slate-100 p-4 rounded-2xl cursor-pointer hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center">
                                      <ImageIcon className="size-4" />
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={async (e) => {
                                          try {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const url = await handleCloudinaryUpload(file);
                                              if (url) updateBlock(block.id, { content: url });
                                            }
                                          } catch (err) {
                                            toast.error("Upload failed");
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              )}

                              {block.type === 'grid' && (
                                <div className="space-y-4">
                                  {Array.isArray(block.urls) && block.urls.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                      {block.urls.map((url: string, i: number) => (
                                        <div key={i} className="w-20 aspect-square rounded-lg overflow-hidden border border-slate-100">
                                          <img src={url} className="w-full h-full object-cover" alt="" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <textarea
                                      value={Array.isArray(block.urls) ? block.urls.join(', ') : ''}
                                      onChange={(e) => updateBlock(block.id, { urls: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                                      className="flex-1 bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all min-h-[80px]"
                                      placeholder="URLs (comma separated)..."
                                    />
                                    <label className="shrink-0 bg-white border border-slate-100 p-4 rounded-2xl cursor-pointer hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center min-h-[80px] w-12">
                                      <Plus className="size-5" />
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const url = await handleCloudinaryUpload(file);
                                            if (url) {
                                              const currentUrls = Array.isArray(block.urls) ? block.urls : [];
                                              updateBlock(block.id, { urls: [...currentUrls, url] });
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

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
                    readOnly={isSectionEditing}
                    type="text" 
                    value={newLink.title}
                    onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                    className={cn(
                      "w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold",
                      isSectionEditing && "opacity-50 cursor-not-allowed"
                    )}
                    placeholder="e.g. My Instagram"
                  />
                </div>
                
                { !isSectionEditing && (
                  <>
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
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Top Position (%)</label>
                    <input 
                      type="text" 
                      value={newLink.top}
                      onChange={(e) => setNewLink({...newLink, top: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      placeholder="e.g. 25%"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Left Position (%)</label>
                    <input 
                      type="text" 
                      value={newLink.left}
                      onChange={(e) => setNewLink({...newLink, left: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                      placeholder="e.g. 10%"
                    />
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
