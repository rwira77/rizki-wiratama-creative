import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { OSMenuBar } from "@/components/OSMenuBar";
import { DesktopIcon } from "@/components/DesktopIcon";
import { Window } from "@/components/Window";
import { 
  User, 
  Briefcase, 
  Layout, 
  Mail, 
  Star, 
  Users,
  Image as ImageIcon,
  Aperture,
  Wifi
} from "lucide-react";

// Content Components
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Experience } from "@/components/Experience";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";

const SECTIONS = [
  { id: "about", title: "About Me", icon: User, component: About, color: "from-orange-400 to-orange-500", subtext: "Bio" },
  { id: "portfolio", title: "My Work", icon: ImageIcon, component: Portfolio, color: "from-blue-500 to-indigo-600", subtext: "78%" },
  { id: "services", title: "Services", icon: Layout, component: Services, color: "from-purple-500 to-fuchsia-600", subtext: "Pro" },
  { id: "experience", title: "Experience", icon: Briefcase, component: Experience, color: "from-emerald-500 to-teal-600", subtext: "Hist" },
  { id: "clients", title: "Clients", icon: Users, component: Clients, color: "from-pink-500 to-rose-600", subtext: "Love" },
  { id: "contact", title: "Contact", icon: Mail, component: Contact, color: "from-red-500 to-orange-600", subtext: "Now" },
];

const DECORATIVE_ICONS = [
  { id: "notion", label: "Notion", icon: Star, type: "app", color: "text-black", top: "15%", left: "12%" },
  { id: "figma", label: "Figma", icon: Aperture, type: "app", color: "text-purple-600", top: "45%", left: "85%" },
  { id: "safari", label: "Safari", icon: Wifi, type: "app", color: "text-blue-500", top: "75%", left: "15%" },
];

const DECORATIVE_FILES = [
  { id: "img1", label: "editorial_v1.jpg", top: "65%", left: "68%" },
  { id: "img2", label: "school_case.png", top: "20%", left: "40%" },
  { id: "img3", label: "brand_guide.pdf", top: "48%", left: "30%" },
];

const Index = () => {
  const [windows, setWindows] = useState<{ id: string; contentId: string }[]>([]);
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({});
  const [maxZ, setMaxZ] = useState(100);

  useEffect(() => {
    document.title = "Rizki Wiratama — Portfolio 2026";
  }, []);

  const openWindow = (contentId: string) => {
    // If ANY window is already open, reuse it and navigate to the new content
    if (windows.length > 0) {
      // Find the most recently opened/focused window
      const targetWindowId = windows[windows.length - 1].id;
      navigateWindow(targetWindowId, contentId);
      return;
    }

    // Otherwise open a new window
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

  // Positions for folders (manual for a "scattered" look)
  const folderPositions = [
    { top: "10%", left: "5%" },    // about
    { top: "25%", left: "65%" },   // portfolio
    { top: "60%", left: "10%" },   // services
    { top: "75%", left: "45%" },   // experience
    { top: "15%", left: "80%" },   // clients
    { top: "70%", left: "75%" },   // contact
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F2EB] noise relative font-sans text-foreground">
      <OSMenuBar />

      {/* Central Background Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5 }}
           className="text-center"
        >
          <em className="font-special-serif text-[6vw] md:text-[4vw] text-blue-500/40 leading-none italic block -mb-4">Rizki Wiratama</em>
          <h1 className="font-special-serif text-[15vw] md:text-[12vw] leading-none text-[#332211]">portfolio</h1>
          <p className="text-[4vw] md:text-2xl font-special-serif text-[#332211]/60 mt-4">(2025)</p>
        </motion.div>
      </div>

      {/* Desktop Content Layer */}
      <main className="relative h-full w-full pt-8">
        {/* Real Content Folders */}
        {SECTIONS.map((section, idx) => (
          <div 
            key={section.id} 
            className="absolute transition-all hidden md:block" 
            style={{ 
              top: folderPositions[idx]?.top || "20%", 
              left: folderPositions[idx]?.left || "20%" 
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
          </div>
        ))}

        {/* Decorative Icons */}
        {DECORATIVE_ICONS.map((dec) => (
          <div 
            key={dec.id} 
            className="absolute hidden md:block" 
            style={{ top: dec.top, left: dec.left }}
          >
            <DesktopIcon
              id={dec.id}
              label={dec.label}
              icon={dec.icon}
              type={dec.type as any}
              color={dec.color}
              onClick={() => {}}
            />
          </div>
        ))}

        {/* Decorative Files */}
        {DECORATIVE_FILES.map((file) => (
          <div 
            key={file.id} 
            className="absolute hidden md:block opacity-60" 
            style={{ top: file.top, left: file.left }}
          >
            <DesktopIcon
              id={file.id}
              label={file.label}
              type="file"
              color="text-amber-600/40"
              onClick={() => {}}
            />
          </div>
        ))}

        {/* Mobile View: Simple Grid (as per user's earlier requirement) */}
        <div className="md:hidden pt-20 p-4 grid grid-cols-3 gap-4">
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
        </div>
      </main>

      {/* Windows */}
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
            <div className="p-4 md:p-8">
              <section.component />
            </div>
          </Window>
        );
      })}

      {/* Custom Global Cursor (Optional, but matches reference) */}
      <style dangerouslySetInnerHTML={{ __html: `
        body { 
          cursor: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3L11 20L14 14L20 11L3 3Z'/%3E%3C/svg%3E"), auto; 
        }
        button, a, .cursor-pointer {
          cursor: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3L11 20L14 14L20 11L3 3Z'/%3E%3C/svg%3E"), pointer !important;
        }
      `}} />
    </div>
  );
};

export default Index;
