import { motion } from "framer-motion";
import portrait from "@/assets/portrait.jpg";

const stats = [
  { value: "+340%", label: "Avg. social growth" },
  { value: "12M+", label: "Impressions generated" },
  { value: "+85%", label: "Sales lift for clients" },
  { value: "5+ yrs", label: "In design & strategy" },
];

export const About = () => {
  return (
    <section id="about" className="container py-32 md:py-44">
      <div className="grid md:grid-cols-12 gap-12 md:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="md:col-span-5"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
            <img
              src={portrait}
              alt="Rizki Wiratama, branding designer and creative strategist"
              loading="lazy"
              width={1024}
              height={1280}
              className="w-full h-full object-cover transition-transform duration-[1.2s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent" />
          </div>
        </motion.div>

        <div className="md:col-span-7 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-primary" /> About
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-balance"
          >
            A creative who thinks like a <em className="text-primary not-italic">marketer</em>.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 space-y-5 text-muted-foreground text-lg leading-relaxed max-w-xl"
          >
            <p>
              For 5+ years I've helped brands speak clearly and sell better — through design,
              content, and the systems behind them. As a former Marketing Manager for a fashion
              label, I led the rebuild of social, content, and commerce — taking the brand from
              quiet presence to category leader.
            </p>
            <p className="text-foreground/80">
              Today I partner with founders and teams to do the same: design that converts,
              content that compounds, campaigns that move numbers.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-sm overflow-hidden">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="bg-background p-6"
              >
                <div className="font-display text-3xl md:text-4xl text-primary">{s.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
