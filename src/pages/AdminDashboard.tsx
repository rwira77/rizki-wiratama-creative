import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
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
  ChevronDown,
  GripVertical,
  Type,
  Folder,
  AlignLeft,
  LayoutGrid,
  Type as TypeIcon
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

const getOptimizedUrl = (url: string, type: 'thumbnail' | 'gallery' | 'full' = 'gallery') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  let transformations = '';
  if (type === 'thumbnail') transformations = 'c_fill,g_auto,w_400,h_400,q_auto,f_auto/';
  if (type === 'gallery') transformations = 'c_limit,w_1200,q_auto,f_auto/';
  if (type === 'full') transformations = 'q_auto,f_auto/';
  
  return `${parts[0]}/upload/${transformations}${parts[1]}`;
};

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
        .order('order_index', { ascending: true });

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

  const handleOpenEdit = (work: any) => {
    setNewProject({
      ...work,
      content_blocks: Array.isArray(work.content_blocks) ? work.content_blocks : []
    });
    setEditingId(work.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Ensure content_blocks is an array
      const projectToSave = {
        ...newProject,
        content_blocks: Array.isArray(newProject.content_blocks) ? newProject.content_blocks : []
      };

      if (isEditing && editingId) {
        const { error } = await supabase
          .from('works')
          .update(projectToSave)
          .eq('id', editingId);
        if (error) throw error;
        toast.success("Project updated!");
      } else {
        const { error } = await supabase
          .from('works')
          .insert([projectToSave]);
        if (error) throw error;
        toast.success("Project created!");
      }
      setIsModalOpen(false);
      fetchWorks();
    } catch (error: any) {
      toast.error("Action failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWork = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from('works').delete().eq('id', id);
      if (error) throw error;
      toast.success("Project deleted");
      fetchWorks();
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
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
            <button 
              onClick={() => setActiveTab("desktop")}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all",
                activeTab === "desktop" ? "bg-slate-900 text-white shadow-xl scale-105" : "text-slate-400 hover:bg-slate-50"
              )}
            >
               <Star className="size-4" /> Desktop Links
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all",
                activeTab === "profile" ? "bg-slate-900 text-white shadow-xl scale-105" : "text-slate-400 hover:bg-slate-50"
              )}
            >
               <PenTool className="size-4" /> Cloudinary Settings
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
            {activeTab === "portfolio" ? "Portfolio" : activeTab === "desktop" ? "Desktop" : "Settings"}
          </h1>
          <div className="flex items-center gap-4">
             {activeTab === "portfolio" && (
               <>
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
                     setIsModalOpen(true);
                   }}
                   className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg"
                 >
                   <Plus className="size-4" /> New Project
                 </button>
               </>
             )}
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="size-10 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
          </div>
        ) : activeTab === "portfolio" ? (
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

            <Reorder.Group 
              axis="y" 
              values={works.filter(w => selectedCategory === 'all' || w.cat === selectedCategory)} 
              onReorder={handleReorder}
              className="space-y-4"
            >
              {works
                .filter(w => selectedCategory === 'all' || w.cat === selectedCategory)
                .map((work) => (
                <Reorder.Item 
                  key={work.id}
                  value={work}
                  whileDrag={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                  className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-6 cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative size-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                    <img src={work.img} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="size-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-special-serif text-xl truncate">{work.title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">{work.cat} • {work.year}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenEdit(work)}
                      className="p-3 text-slate-300 hover:text-slate-900 transition-colors"
                    >
                      <PenTool className="size-4" />
                    </button>
                    <button 
                      onClick={() => deleteWork(work.id)}
                      className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        ) : activeTab === "profile" ? (
          <div className="max-w-2xl bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm">
             <h2 className="font-special-serif text-3xl mb-8">Cloudinary Config</h2>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cloud Name</label>
                  <input 
                    type="text" 
                    value={cloudinarySettings.cloudName}
                    onChange={(e) => {
                      setCloudinarySettings({...cloudinarySettings, cloudName: e.target.value});
                      localStorage.setItem('cloudinary_cloud_name', e.target.value);
                    }}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Preset</label>
                  <input 
                    type="text" 
                    value={cloudinarySettings.uploadPreset}
                    onChange={(e) => {
                      setCloudinarySettings({...cloudinarySettings, uploadPreset: e.target.value});
                      localStorage.setItem('cloudinary_upload_preset', e.target.value);
                    }}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic">Settings are saved locally in your browser for security.</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-slate-300 italic">
            <Star className="size-12 mb-4 opacity-20" />
            Desktop links management coming soon in next restore...
          </div>
        )}
      </main>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="font-special-serif text-4xl">{isEditing ? "Modify Project" : "New Creation"}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mt-2">Design System Administrator</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                  <X className="size-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <form onSubmit={handleProjectSubmit} id="project-form" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Project Title</label>
                      <input 
                        required
                        type="text" 
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                        placeholder="e.g. Minimalist Branding"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
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
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Year</label>
                        <input 
                          type="text" 
                          value={newProject.year}
                          onChange={(e) => setNewProject({...newProject, year: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Cover Image</label>
                      <div className="flex gap-4">
                        <input 
                          required
                          type="text" 
                          value={newProject.img}
                          onChange={(e) => setNewProject({...newProject, img: e.target.value})}
                          className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs"
                          placeholder="Cloudinary URL..."
                        />
                        <input 
                          type="file" 
                          id="cover-upload" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleCloudinaryUpload(file);
                              if (url) setNewProject({...newProject, img: url});
                            }
                          }}
                        />
                        <label htmlFor="cover-upload" className="cursor-pointer bg-slate-900 text-white p-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center shrink-0">
                          <ImageIcon className="size-5" />
                        </label>
                      </div>
                      {newProject.img && (
                        <div className="aspect-video rounded-[2rem] overflow-hidden border border-slate-100">
                          <img src={getOptimizedUrl(newProject.img)} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                      <div>
                        <p className="font-bold text-sm">Enable Case Study Detail</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">Activate rich content blocks</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setNewProject({...newProject, hasDetail: !newProject.hasDetail})}
                        className={cn(
                          "w-14 h-8 rounded-full p-1 transition-all",
                          newProject.hasDetail ? "bg-emerald-500" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "size-6 bg-white rounded-full transition-transform shadow-sm",
                          newProject.hasDetail ? "translate-x-6" : "translate-x-0"
                        )} />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Case Study Content */}
                  <div className={cn("space-y-8 transition-opacity", !newProject.hasDetail && "opacity-20 pointer-events-none")}>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">The Problem</label>
                        <textarea 
                          value={newProject.problem}
                          onChange={(e) => setNewProject({...newProject, problem: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold h-32 resize-none"
                          placeholder="Challenge description..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">The Result</label>
                        <textarea 
                          value={newProject.result}
                          onChange={(e) => setNewProject({...newProject, result: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold h-32 resize-none"
                          placeholder="Outcome description..."
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Content Blocks</label>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => addBlock('text')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Type className="size-4" /></button>
                          <button type="button" onClick={() => addBlock('image')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><ImageIcon className="size-4" /></button>
                          <button type="button" onClick={() => addBlock('grid')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><LayoutGrid className="size-4" /></button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(newProject.content_blocks || []).map((block, idx) => (
                          <div key={block.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{block.type} Block</span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={() => moveBlock(idx, 'up')} className="p-1 hover:bg-white rounded shadow-sm"><ChevronUp className="size-3" /></button>
                                <button type="button" onClick={() => moveBlock(idx, 'down')} className="p-1 hover:bg-white rounded shadow-sm"><ChevronDown className="size-3" /></button>
                                <button type="button" onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="size-3" /></button>
                              </div>
                            </div>

                            {block.type === 'text' && (
                              <div className="space-y-4">
                                <textarea 
                                  value={block.content}
                                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                  className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold text-sm h-24 resize-none"
                                />
                                <select 
                                  value={block.style}
                                  onChange={(e) => updateBlock(block.id, { style: e.target.value })}
                                  className="w-full bg-white border-none rounded-xl py-2 px-4 text-[10px] font-black uppercase tracking-widest appearance-none"
                                >
                                  <option value="paragraph">Paragraph</option>
                                  <option value="heading">Heading</option>
                                  <option value="quote">Quote</option>
                                </select>
                              </div>
                            )}

                            {block.type === 'image' && (
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                    className="flex-1 bg-white border-none rounded-xl py-3 px-4 font-bold text-[10px]"
                                    placeholder="Cloudinary URL..."
                                  />
                                  <input 
                                    type="file" 
                                    id={`upload-${block.id}`} 
                                    className="hidden" 
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const url = await handleCloudinaryUpload(file);
                                        if (url) updateBlock(block.id, { content: url });
                                      }
                                    }}
                                  />
                                  <label htmlFor={`upload-${block.id}`} className="cursor-pointer bg-slate-900 text-white p-3 rounded-xl hover:bg-black shrink-0"><ImageIcon className="size-4" /></label>
                                </div>
                                {block.content && <img src={getOptimizedUrl(block.content, 'gallery')} className="w-full h-32 object-cover rounded-xl" />}
                              </div>
                            )}

                            {block.type === 'grid' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                  {(block.urls || []).map((url: string, uIdx: number) => (
                                    <div key={uIdx} className="relative aspect-square rounded-xl overflow-hidden group/img">
                                      <img src={getOptimizedUrl(url, 'thumbnail')} className="w-full h-full object-cover" />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const newUrls = [...(block.urls || [])];
                                          newUrls.splice(uIdx, 1);
                                          updateBlock(block.id, { urls: newUrls });
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                                      >
                                        <X className="size-3" />
                                      </button>
                                    </div>
                                  ))}
                                  <input 
                                    type="file" 
                                    id={`grid-add-${block.id}`} 
                                    className="hidden" 
                                    multiple
                                    onChange={async (e) => {
                                      const files = e.target.files;
                                      if (files) {
                                        const newUrls = [...(block.urls || [])];
                                        for (let i = 0; i < files.length; i++) {
                                          const url = await handleCloudinaryUpload(files[i]);
                                          if (url) newUrls.push(url);
                                        }
                                        updateBlock(block.id, { urls: newUrls });
                                      }
                                    }}
                                  />
                                  <label htmlFor={`grid-add-${block.id}`} className="cursor-pointer border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-primary hover:text-primary transition-all aspect-square">
                                    <Plus className="size-6" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Add Images</span>
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="project-form"
                  disabled={isLoading}
                  className="px-16 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-2xl disabled:opacity-50"
                >
                  {isEditing ? "Save Evolution" : "Launch Creation"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
