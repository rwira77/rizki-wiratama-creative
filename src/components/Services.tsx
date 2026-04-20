import { motion } from "framer-motion";
import { Palette, Megaphone, Camera, Sparkles } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Branding & Logo Design",
    desc: "Identity systems, logos, and visual languages that scale with your business.",
    items: ["Brand strategy", "Logo & identity", "Guidelines"],
  },
  {
    icon: Megaphone,
    title: "Social Media Management",
    desc: "End-to-end content strategy, design, and growth — built for engagement and sales.",
    items: ["Content strategy", "Feed design", "Growth & analytics"],
  },
  {
    icon: Camera,
    title: "Content Creation",
    desc: "Photography & videography that captures the brand in its truest, sharpest light.",
    items: ["Product photography", "Lookbooks", "Reels & video ads"],
  },
  {
    icon: Sparkles,
    title: "Creative Campaigns & Events",
    desc: "Concept-to-execution campaigns and brand activations that people remember.",
    items: ["Campaign concepts", "Event direction", "Collaborations"],
  },
];

export const Services = () => {
  return (
    <section id="services" className="border-t border-border bg-secondary/30">
      <div className="container py-32 md:py-44">
        <div className="grid md:grid-cols-12 gap-10 mb-20">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" /> Services
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-balance">
              Four crafts.<br />
              <em className="text-primary not-italic">One vision.</em>
            </h2>
          </div>
          <p className="md:col-span-5 md:col-start-8 text-lg text-muted-foreground leading-relaxed self-end">
            From identity to execution, every project is shaped by the same goal:
            move the metrics that matter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-border">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative bg-background p-10 md:p-14 transition-colors duration-500 hover:bg-secondary/50"
            >
              <div className="flex items-start justify-between mb-12">
                <s.icon className="size-7 text-primary" strokeWidth={1.2} />
                <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl mb-4 leading-tight">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">{s.desc}</p>
              <ul className="flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="text-xs uppercase tracking-wider px-3 py-1.5 border border-border rounded-full text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-colors duration-300"
                  >
                    {it}
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
