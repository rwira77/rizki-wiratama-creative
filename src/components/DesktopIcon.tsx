import { motion } from "framer-motion";
import { Folder, FileText, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  type?: "folder" | "file" | "app";
  color?: string; // Gradient class or hex
  subtext?: string;
  onClick: () => void;
  className?: string;
}

export const DesktopIcon = ({
  label,
  icon: Icon,
  type = "folder",
  color = "from-blue-500 to-blue-600",
  subtext,
  onClick,
  className,
}: DesktopIconProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 w-24 sm:w-32 group",
        className
      )}
    >
      <div className="relative mb-3 h-20 w-20 flex items-center justify-center">
        {type === "folder" ? (
          <div className="relative w-full h-full">
            {/* Back Fold */}
            <div className={cn(
              "absolute top-0 left-0 w-2/3 h-3 rounded-t-lg bg-gradient-to-br opacity-80",
              color
            )} />
            
            {/* Folder Papers */}
            <div className="absolute top-1 left-2 right-2 h-14 bg-white/90 rounded-sm shadow-sm rotate-[-3deg] z-0" />
            <div className="absolute top-2 left-3 right-3 h-14 bg-white/70 rounded-sm shadow-sm rotate-[2deg] z-0" />
            
            {/* Folder Body / Front Flap */}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-16 rounded-lg bg-gradient-to-br shadow-icon z-10 p-2 flex flex-col justify-between overflow-hidden",
              color
            )}>
              {/* Glassmorphic overlay for the front */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] transition-opacity group-hover:opacity-0" />
              
              <div className="flex justify-between items-start z-20">
                {Icon && <Icon className="size-4 text-white/50" />}
                {subtext && <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{subtext}</span>}
              </div>
              
              <div className="z-20">
                <div className="h-0.5 w-4 bg-white/30 rounded-full mb-1" />
                <div className="h-0.5 w-6 bg-white/20 rounded-full" />
              </div>

              {/* Progress-like number in the corner (if subtext is numeric-ish) */}
              {label.includes("Work") && (
                <div className="absolute bottom-2 right-2 text-white/70 font-display text-lg leading-none">
                  25
                </div>
              )}
            </div>
          </div>
        ) : Icon ? (
          <div className="p-4 bg-white rounded-2xl shadow-icon group-hover:shadow-lg transition-all">
            <Icon className={cn("size-10 sm:size-12", color)} strokeWidth={1.5} />
          </div>
        ) : (
          <FileText className={cn("size-10 sm:size-12", color)} strokeWidth={1.5} />
        )}
      </div>
      
      <div className="text-center z-20">
        <span className="text-[11px] sm:text-xs font-semibold leading-tight px-2 py-0.5 rounded-full bg-white/50 backdrop-blur-sm shadow-sm group-hover:bg-primary group-hover:text-white transition-colors block whitespace-nowrap">
          {label}
        </span>
      </div>
    </motion.div>
  );
};
