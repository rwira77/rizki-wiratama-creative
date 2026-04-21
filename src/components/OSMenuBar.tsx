import { useState, useEffect } from "react";
import { Aperture, Wifi, Battery, Search } from "lucide-react";

export const OSMenuBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-white/70 backdrop-blur-md border-b flex items-center justify-between px-4 z-[9999] text-[13px] font-medium select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-bold">
          <Aperture className="size-4" />
          <span>Rizki OS</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 opacity-80">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
          <span>Help</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 opacity-70">
          <Wifi className="size-4" />
          <Battery className="size-4" />
          <Search className="size-4" />
        </div>
        <div className="min-w-[120px] text-right">
          {time.toLocaleDateString("en-US", { 
            weekday: "short", 
            month: "short", 
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      </div>
    </div>
  );
};
