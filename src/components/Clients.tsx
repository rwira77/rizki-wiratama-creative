import { motion } from "framer-motion";

const clients = [
  "MAISON", "Atelier 04", "Remlint", "Soirée", "North & Co.", "Studio Folde",
  "Verre", "Kanvas", "Mode Lab", "Halo Studio",
];

export const Clients = () => {
  return (
    <section className="container py-24 md:py-32">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-xs uppercase tracking-[0.3em] text-muted-foreground text-center mb-12"
      >
        Trusted by brands & founders across Indonesia
      </motion.p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-sm overflow-hidden">
        {clients.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="bg-background h-24 flex items-center justify-center group hover:bg-secondary/50 transition-colors duration-500"
          >
            <span className="font-display text-xl md:text-2xl text-muted-foreground tracking-wide group-hover:text-primary transition-colors duration-500">
              {c}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
