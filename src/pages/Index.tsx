import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OSMenuBar } from "@/components/OSMenuBar";
import { DesktopIcon } from "@/components/DesktopIcon";
import { Window } from "@/components/Window";
import portrait from "@/assets/rizki-portrait.png";
import { 
  User, 
  Briefcase, 
  Layout, 
  Mail, 
  Star, 
  Users,
  Image as ImageIcon,
  Aperture,
  Wifi,
  Home,
  Layers,
  Phone,
  Settings,
  MapPin,
  BadgeCheck
} from "lucide-react";

import { SECTIONS } from "@/config/sections";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";


const Index = () => {
  const [windows, setWindows] = useState<{ id: string; contentId: string }[]>([]);
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({});
  const [maxZ, setMaxZ] = useState(100);
  const [desktopLinks, setDesktopLinks] = useState<any[]>([]);
  const [sectionPositions, setSectionPositions] = useState<Record<string, {top: string, left: string}>>({});
  const [isPositionsLoaded, setIsPositionsLoaded] = useState(false);

  useEffect(() => {
    document.title = "Rizki Wiratama - Portfolio";
    fetchDesktopLinks();
    fetchSectionPositions();
  }, []);

  const fetchDesktopLinks = async () => {
    try {
      const { data, error } = await supabase.from('desktop_links').select('*');
      if (error) throw error;
      setDesktopLinks(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSectionPositions = async () => {
    try {
      const { data, error } = await supabase.from('section_settings').select('*');
      if (error) throw error;
      const positions = data.reduce((acc: any, curr: any) => {
        acc[curr.id] = { top: curr.top, left: curr.left };
        return acc;
      }, {});
      setSectionPositions(positions);
      setIsPositionsLoaded(true);
    } catch (err) {
      console.error(err);
      setIsPositionsLoaded(true); // Still set to true to show default icons if fetch fails
    }
  };

  const openWindow = (contentId: string) => {
    if (windows.length > 0) {
      const targetWindowId = windows[windows.length - 1].id;
      navigateWindow(targetWindowId, contentId);
      return;
    }
    const newId = `window-${Date.now()}`;
    setWindows([{ id: newId, contentId }]);
    focusWindow(newId);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter((w) => w.id !== id));
  };

  const focusWindow = (id: string) => {
    const newMaxZ = maxZ + 1;
    setWindowZIndices(prev => ({ ...prev, [id]: newMaxZ }));
    setMaxZ(newMaxZ);
  };

  const navigateWindow = (windowId: string, targetContentId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, contentId: targetContentId } : w
    ));
    focusWindow(windowId);
  };

  const defaultPositions: Record<string, {top: string, left: string}> = {
    about: { top: "10%", left: "5%" },    
    portfolio: { top: "25%", left: "65%" },   
    services: { top: "60%", left: "10%" },   
    experience: { top: "75%", left: "45%" },   
    clients: { top: "15%", left: "80%" },   
    contact: { top: "70%", left: "75%" },   
  };

  const getPos = (id: string) => sectionPositions[id] || defaultPositions[id] || { top: "20%", left: "20%" };

  const currentMobileTab = windows.length > 0 ? windows[0].contentId : "home";

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F2EB] noise relative font-sans text-foreground">
      <OSMenuBar />

      {/* Central Background Title (Desktop Only) */}
      <div className="hidden md:flex absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5 }}
           className="text-center"
        >
          <em className="font-special-serif text-[4vw] text-blue-500/40 leading-none italic block -mb-4">Rizki Wiratama</em>
          <h1 className="font-special-serif text-[12vw] leading-none text-[#332211]">portfolio</h1>
          <p className="text-2xl font-special-serif text-[#332211]/60 mt-4">(2025)</p>
        </motion.div>
      </div>

      {/* Desktop Content Layer */}
      <main className="relative h-full w-full pt-8 custom-scrollbar overflow-auto md:overflow-hidden pb-32 md:pb-0">
        {/* Real Content Folders (Desktop Only) */}
        <div className="hidden md:block">
          <AnimatePresence>
            {isPositionsLoaded && SECTIONS.map((section) => (
              <motion.div 
                key={section.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute transition-all" 
                style={{ 
                  top: getPos(section.id).top, 
                  left: getPos(section.id).left 
                }}
              >
                <DesktopIcon
                  id={section.id}
                  label={section.title}
                  icon={section.icon}
                  color={section.color}
                  subtext={section.subtext}
                  onClick={() => openWindow(section.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Dynamic Desktop Ecosystem Links */}
          {desktopLinks.map((link) => {
            const top = link.top?.toString().includes('%') ? link.top : `${link.top || 15}%`;
            const left = link.left?.toString().includes('%') ? link.left : `${link.left || 15}%`;
            return (
              <div 
                key={link.id} 
                className="absolute group z-10" 
                style={{ top, left }}
              >
                <DesktopIcon 
                  id={link.id} 
                  label={link.title} 
                  icon={Star} 
                  iconUrl={link.icon_url}
                  size="sm"
                  type="app" 
                  color={link.color} 
                  onClick={() => window.open(link.url, '_blank')} 
                />
              </div>
            );
          })}
        </div>

        {/* --- MOBILE HOME SCREEN --- */}
        <div className="md:hidden flex flex-col px-4 pt-[52px] pb-40 space-y-10">
          {/* Mobile Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group w-full"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-blue-400/20 to-purple-400/20 rounded-[3rem] blur-2xl opacity-50" />
            <div className="relative bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white p-6 shadow-2xl flex flex-col items-center text-center">
               <div className="relative size-24 mb-4">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="relative size-24 rounded-full border-4 border-white shadow-xl overflow-hidden">
                    <img src={portrait} alt="Rizki Wiratama" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
                    <BadgeCheck className="size-4" />
                  </div>
               </div>
               <h2 className="font-special-serif text-3xl text-slate-900 mb-1">Rizki Wiratama</h2>
               <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full mb-6">
                  <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-green-600">Available For Lead</span>
               </div>
               <div className="w-full grid grid-cols-2 gap-4">
                  <div className="bg-white/40 p-4 rounded-3xl border border-white/50 text-left">
                    <MapPin className="size-4 text-red-500 mb-2" />
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Location</p>
                    <p className="text-xs font-black text-slate-900 mt-1">Jakarta, ID</p>
                  </div>
                  <div className="bg-white/40 p-4 rounded-3xl border border-white/50 text-left">
                    <Star className="size-4 text-yellow-500 mb-2" />
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</p>
                    <p className="text-xs font-black text-slate-900 mt-1">Top Rated</p>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Mobile Folders Grid */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-2 flex items-center gap-4">
               Favorites <div className="flex-1 h-px bg-slate-200" />
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {SECTIONS.map((section) => (
                <DesktopIcon
                  key={section.id}
                  id={section.id}
                  label={section.title}
                  icon={section.icon}
                  color={section.color}
                  subtext={section.subtext}
                  onClick={() => openWindow(section.id)}
                />
              ))}
              {desktopLinks.map((link) => (
                <DesktopIcon
                  key={link.id}
                  id={link.id}
                  label={link.title}
                  icon={Star}
                  iconUrl={link.icon_url}
                  type="app"
                  color={link.color}
                  onClick={() => window.open(link.url, '_blank')}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVBAR --- */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-[2000]">
         <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl rounded-[32px] p-1.5 border border-white/10 shadow-2xl flex items-center justify-between px-3 h-16">
            {/* Inner Glass Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
            
            {[
              { id: 'home', icon: Home, label: 'Home', color: 'text-blue-400', action: () => setWindows([]) },
              { id: 'portfolio', icon: ImageIcon, label: 'Work', color: 'text-indigo-400', action: () => openWindow('portfolio') },
              { id: 'services', icon: Aperture, label: 'Services', color: 'text-purple-400', action: () => openWindow('services') },
              { id: 'experience', icon: Briefcase, label: 'Resume', color: 'text-emerald-400', action: () => openWindow('experience') },
              { id: 'contact', icon: Mail, label: 'Contact', color: 'text-pink-400', action: () => openWindow('contact') }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={item.action}
                className={cn(
                  "relative z-10 p-2.5 rounded-2xl transition-all duration-500 flex flex-col items-center gap-1", 
                  currentMobileTab === item.id 
                    ? "bg-white scale-110 shadow-lg" 
                    : "text-white/30"
                )}
              >
                 <item.icon className={cn(
                   "size-5 transition-colors duration-500", 
                   currentMobileTab === item.id ? item.color.replace('text-', 'text-') + " stroke-[2.5px]" : "text-white/40 stroke-[1.5px]"
                 )} />
                 {currentMobileTab === item.id && (
                   <motion.span 
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className={cn("text-[7px] font-black uppercase tracking-widest", item.color)}
                   >
                     {item.label}
                   </motion.span>
                 )}
              </button>
            ))}
         </div>
      </div>

      {/* Windows Overlay */}
      {windows.map((win) => {
        const section = SECTIONS.find(s => s.id === win.contentId) || SECTIONS[0];
        return (
          <Window
            key={win.id}
            id={win.contentId}
            title={section.title}
            isOpen={true}
            onClose={() => closeWindow(win.id)}
            onNavigate={(targetId) => navigateWindow(win.id, targetId)}
            zIndex={windowZIndices[win.id] || 100}
            onFocus={() => focusWindow(win.id)}
          >
            <div className="p-4 md:pt-12 md:pb-8 md:px-8">
              <section.component />
            </div>
          </Window>
        );
      })}

      {/* Global Style Enhancements */}
      <style dangerouslySetInnerHTML={{ __html: `
        body { cursor: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3L11 20L14 14L20 11L3 3Z'/%3E%3C/svg%3E"), auto; }
        button, a, .cursor-pointer { cursor: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3L11 20L14 14L20 11L3 3Z'/%3E%3C/svg%3E"), pointer !important; }
        .noise { position: relative; }
        .noise::before { content: ""; position: fixed; inset: 0; background-image: url("https://grainy-gradients.vercel.app/noise.svg"); opacity: 0.05; pointer-events: none; z-index: 1000; }
      `}} />
    </div>
  );
};

export default Index;
