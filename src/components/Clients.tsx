import { motion } from "framer-motion";
import banjarmasinLogo from "@/assets/logoclient/Banjarmasin_Logo.svg";
import choutureLogo from "@/assets/logoclient/Chouture-22.png";
import dofaceLogo from "@/assets/logoclient/Doface-Pink1.png";
import kafLogo from "@/assets/logoclient/KAF_Logo_Transparen-02.png";
import lisLogo from "@/assets/logoclient/LISLogo-05.png";
import rayanaLogo from "@/assets/logoclient/Rayana-Logo-07.png";
import thrLogo from "@/assets/logoclient/ThrLogo-Tr1.png";
import donnaLogo from "@/assets/logoclient/donna-logo.png";

const clients = [
  {
    name: "Kota Banjarmasin",
    category: "Pemerintah Kota",
    logo: banjarmasinLogo,
  },
  {
    name: "Donna Privé",
    category: "Modest Fashion",
    logo: donnaLogo,
  },
  {
    name: "Doface",
    category: "Beauty & Skincare",
    logo: dofaceLogo,
  },
  {
    name: "Chouture",
    category: "Fashion & Lifestyle",
    logo: choutureLogo,
  },
  {
    name: "Rayana",
    category: "Apparel & Retail",
    logo: rayanaLogo,
  },
  {
    name: "THR",
    category: "Creative Agency",
    logo: thrLogo,
  },
  {
    name: "LIS",
    category: "Brand & Production",
    logo: lisLogo,
  },
  {
    name: "KAF",
    category: "Corporate Enterprise",
    logo: kafLogo,
  },
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

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {clients.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center bg-white/60 hover:bg-white/95 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[160px]"
          >
            <div className="h-20 w-full flex items-center justify-center p-2">
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-16 w-auto max-w-[85%] object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="mt-3 text-center">
              <h4 className="text-xs md:text-sm font-semibold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                {c.name}
              </h4>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
                {c.category}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
