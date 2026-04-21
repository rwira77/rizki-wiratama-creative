import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square, ChevronLeft, ChevronRight, LayoutGrid, List, Search, Folder, User, Briefcase, Mail, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (id: string) => void;
  children: React.ReactNode;
  zIndex: number;
  onFocus: () => void;
  className?: string;
}

const SIDEBAR_ITEMS = [
  { label: "About", icon: User, id: "about" },
  { label: "Services", icon: Sparkles, id: "services" },
  { label: "Portfolio", icon: Folder, id: "portfolio" },
  { label: "Resume", icon: Briefcase, id: "experience" },
  { label: "Contact", icon: Mail, id: "contact" },
];

export const Window = ({
  id,
  title,
  isOpen,
  onClose,
  onNavigate,
  children,
  zIndex,
  onFocus,
  className,
}: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const currentIndex = SIDEBAR_ITEMS.findIndex(item => item.id === id);

  const goBack = () => {
    if (currentIndex > 0) {
      onNavigate?.(SIDEBAR_ITEMS[currentIndex - 1].id);
    }
  };

  const goForward = () => {
    if (currentIndex < SIDEBAR_ITEMS.length - 1) {
      onNavigate?.(SIDEBAR_ITEMS[currentIndex + 1].id);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const effectiveMaximized = isMaximized || isMobile;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Click to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[800]"
          />

          <motion.div
            initial={isMobile ? { y: "100%", opacity: 0 } : { scale: 0.95, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { type: "spring", damping: 30, stiffness: 400 }
            }}
            exit={isMobile ? { y: "100%", opacity: 0 } : { scale: 0.95, opacity: 0, y: 20 }}
            drag={!effectiveMaximized}
            dragMomentum={false}
            onPointerDown={onFocus}
            style={{ zIndex }}
            className={cn(
               "fixed bg-white/40 backdrop-blur-3xl overflow-hidden border border-white/50 flex flex-col transition-all duration-500",
               effectiveMaximized 
                ? "inset-0 md:inset-4 md:top-12 z-[1000] rounded-none md:rounded-[2.5rem] shadow-none" 
                : "w-[96vw] md:w-[1100px] h-[88vh] rounded-[2.5rem] top-12 left-[2%] md:left-[10%] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15),inset_0_0_0_1px_rgba(255,255,255,0.4)]",
               className
            )}
          >
          {/* Subtle Glass Glare */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none z-0" />

          {/* Main Title Bar (Control Area) */}
          <div className="h-16 bg-white/20 border-b border-white/20 flex items-center justify-between px-8 shrink-0 z-50">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="size-3.5 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 flex items-center justify-center group shadow-md"
                >
                  <X className="size-2 text-red-900/60 opacity-0 group-hover:opacity-100" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
                  className="size-3.5 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 flex items-center justify-center group shadow-inner hidden md:flex"
                >
                  <div className="size-2 bg-green-900/40 rounded-full opacity-0 group-hover:opacity-100" />
                </button>
              </div>

              {/* Window Navigation */}
              <div className="flex items-center gap-2 ml-4">
                <button 
                  onClick={goBack}
                  disabled={currentIndex <= 0}
                  className={cn("p-1 rounded-md transition-colors hover:bg-black/5 disabled:opacity-20")}
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button 
                  onClick={goForward}
                  disabled={currentIndex >= SIDEBAR_ITEMS.length - 1}
                  className={cn("p-1 rounded-md transition-colors hover:bg-black/5 disabled:opacity-20")}
                >
                  <ChevronRight className="size-5" />
                </button>
                <span className="text-sm font-bold ml-2 tracking-tight text-black/80">{title}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-40">
              <div className="flex items-center border rounded-lg overflow-hidden bg-white/50">
                <div className="p-1 px-2 bg-black/5"><LayoutGrid className="size-3.5" /></div>
                <div className="p-1 px-2 border-l"><List className="size-3.5" /></div>
              </div>
              <Search className="size-5" />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar (Finder Style) */}
            <aside className="hidden md:flex w-56 bg-white/10 border-r border-white/20 flex-col p-6 gap-8 shrink-0 relative z-10">
               <div className="space-y-5">
                 <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] px-3">Favorites</p>
                 <nav className="space-y-1.5">
                   {SIDEBAR_ITEMS.map((item) => (
                     <div 
                      key={item.id} 
                      onClick={() => onNavigate?.(item.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-medium transition-all cursor-pointer group/item",
                        id === item.id 
                          ? "bg-white/80 text-black shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] border border-white/50 backdrop-blur-md" 
                          : "text-black/60 hover:bg-white/40 hover:text-black"
                      )}
                    >
                       <item.icon className={cn("size-4 transition-colors", id === item.id ? "text-primary" : "text-primary/60 group-hover/item:text-primary")} />
                       {item.label}
                     </div>
                   ))}
                 </nav>
               </div>
               
               <div className="mt-auto space-y-5">
                 <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] px-3">Tags</p>
                 <div className="px-4 flex flex-col gap-4">
                   <div 
                    onClick={() => onNavigate?.("services")}
                    className="flex items-center gap-3 transition-opacity hover:opacity-100 opacity-60 cursor-pointer"
                   >
                     <div className="size-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                     <span className="text-[12px] font-medium">Design</span>
                   </div>
                   <div 
                    onClick={() => onNavigate?.("experience")}
                    className="flex items-center gap-3 transition-opacity hover:opacity-100 opacity-60 cursor-pointer"
                   >
                     <div className="size-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                     <span className="text-[12px] font-medium">Strategy</span>
                   </div>
                 </div>
               </div>
            </aside>

            {/* Main Window Content */}
            <main className="flex-1 overflow-auto bg-white/5 relative custom-scrollbar z-0">
              <div className="sticky top-0 h-16 bg-gradient-to-b from-[#FDFCF9]/80 to-transparent pointer-events-none z-10" />
              <div className="px-8 pb-24 md:px-16">
                {children}
              </div>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
