import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import banjarmasinLogo from "@/assets/logoclient/Banjarmasin_Logo.svg";
import choutureLogo from "@/assets/logoclient/Chouture-22.png";
import dofaceLogo from "@/assets/logoclient/Doface-Pink1.png";
import kafLogo from "@/assets/logoclient/KAF_Logo_Transparen-02.png";
import lisLogo from "@/assets/logoclient/LISLogo-05.png";
import rayanaLogo from "@/assets/logoclient/Rayana-Logo-07.png";
import thrLogo from "@/assets/logoclient/ThrLogo-Tr1.png";
import donnaLogo from "@/assets/logoclient/donna-logo.png";

const clients = [
  { name: "Kota Banjarmasin", logo: banjarmasinLogo, scale: "h-14 md:h-16" },
  { name: "Donna Privé", logo: donnaLogo, scale: "h-8 md:h-10" },
  { name: "Doface", logo: dofaceLogo, scale: "h-7 md:h-9" },
  { name: "Chouture", logo: choutureLogo, scale: "h-7 md:h-9" },
  { name: "Rayana", logo: rayanaLogo, scale: "h-8 md:h-10" },
  { name: "THR", logo: thrLogo, scale: "h-7 md:h-9" },
  { name: "LIS", logo: lisLogo, scale: "h-8 md:h-10" },
  { name: "KAF", logo: kafLogo, scale: "h-7 md:h-9" },
];

export const Clients = () => {
  return (
    <section id="clients" className="pt-0 pb-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="h-px w-12 bg-primary/40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-black">
            Selected Clients & Partners
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-special-serif text-4xl md:text-6xl leading-tight tracking-tight text-slate-900"
          >
            Trusted by <span className="text-primary italic">brands & institutions.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm text-slate-500 max-w-sm"
          >
            Delivering creative direction, visual branding, and digital growth strategies for visionary teams across Indonesia.
          </motion.p>
        </div>
      </div>

      {/* Pure Logos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-10 py-8 items-center justify-items-center">
        {clients.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group w-full h-20 md:h-24 flex items-center justify-center p-2"
          >
            <img
              src={c.logo}
              alt={c.name}
              className={cn(
                "w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-110 select-none",
                c.scale
              )}
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
