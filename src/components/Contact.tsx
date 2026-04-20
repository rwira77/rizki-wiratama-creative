import { motion } from "framer-motion";
import { Mail, MessageCircle, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

const channels = [
  { icon: MessageCircle, label: "WhatsApp", value: "+62 812 3456 7890", href: "https://wa.me/6281234567890" },
  { icon: Mail, label: "Email", value: "hello@rizkiwiratama.com", href: "mailto:hello@rizkiwiratama.com" },
  { icon: Instagram, label: "Instagram", value: "@rizkiwiratama", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", value: "Rizki Wiratama", href: "https://linkedin.com" },
];

export const Contact = () => {
  return (
    <section id="contact" className="relative border-t border-border noise overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />
      <div className="container py-32 md:py-48">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-primary" /> Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="font-display text-5xl md:text-8xl font-light leading-[0.95] tracking-tight text-balance max-w-5xl"
        >
          Let's build something <em className="text-primary not-italic">great</em> together.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-lg text-muted-foreground max-w-xl"
        >
          Currently accepting select branding, content, and campaign projects for 2026.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          href="mailto:hello@rizkiwiratama.com"
          className="group inline-flex items-center gap-4 mt-12 px-8 py-5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-500 hover:gap-6"
        >
          Start a project
          <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" />
        </motion.a>

        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-sm overflow-hidden">
          {channels.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-background p-8 group hover:bg-secondary/50 transition-colors duration-500"
            >
              <c.icon className="size-5 text-primary mb-6" strokeWidth={1.4} />
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{c.label}</p>
              <p className="font-display text-lg group-hover:text-primary transition-colors">{c.value}</p>
            </motion.a>
          ))}
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="container py-8 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
          <p>© 2026 Rizki Wiratama. Crafted in Jakarta.</p>
          <p className="font-display italic">Available worldwide · Based in Indonesia</p>
        </div>
      </footer>
    </section>
  );
};
