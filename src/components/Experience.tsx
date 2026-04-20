import { motion } from "framer-motion";

const track = [
  {
    year: "2022 — 2024",
    role: "Marketing Manager",
    company: "Indie Fashion Label",
    bullets: [
      "Scaled Instagram from 12K → 180K (+1,400%)",
      "Drove +85% online sales YoY through content & campaigns",
      "Directed 14 seasonal campaigns and 4 brand events",
    ],
  },
  {
    year: "2020 — 2022",
    role: "Brand & Content Lead",
    company: "Creative Studio (Jakarta)",
    bullets: [
      "Built brand systems for 20+ founders & SMEs",
      "Generated 12M+ organic impressions across client accounts",
      "Established content production playbook still in use",
    ],
  },
  {
    year: "2019 — 2020",
    role: "Freelance Designer & Photographer",
    company: "Independent",
    bullets: [
      "Branding, photography, and social design across F&B and fashion",
      "Developed signature editorial visual style",
    ],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="border-t border-border bg-secondary/30">
      <div className="container py-32 md:py-44">
        <div className="grid md:grid-cols-12 gap-10 mb-20">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" /> Track Record
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-balance">
              Receipts, not <em className="text-primary not-italic">promises</em>.
            </h2>
          </div>
        </div>

        <div className="space-y-px bg-border rounded-sm overflow-hidden">
          {track.map((t, i) => (
            <motion.div
              key={t.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid md:grid-cols-12 gap-6 bg-background p-8 md:p-12 group hover:bg-secondary/40 transition-colors duration-500"
            >
              <div className="md:col-span-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.year}</p>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-display text-2xl md:text-3xl">{t.role}</h3>
                <p className="text-muted-foreground mt-1">{t.company}</p>
              </div>
              <ul className="md:col-span-5 space-y-3">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-foreground/85">
                    <span className="text-primary mt-2 size-1 rounded-full bg-primary shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
