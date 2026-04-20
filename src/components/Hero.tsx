import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-32 pb-16 noise">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />

      <div className="container">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-primary" />
          Jakarta · Indonesia · Available 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          className="font-display font-light text-[14vw] md:text-[10vw] leading-[0.9] tracking-[-0.04em] text-balance"
        >
          Building <em className="text-primary not-italic font-normal italic-display">brands</em>
          <br />
          that actually <span className="font-medium">grow.</span>
        </motion.h1>

        <div className="mt-16 grid md:grid-cols-12 gap-10 items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="md:col-span-5 md:col-start-7 text-lg text-muted-foreground leading-relaxed text-balance"
          >
            I'm <span className="text-foreground">Rizki Wiratama</span> — a multi-disciplinary creative
            blending branding, content, and strategy to turn brands into measurable growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="md:col-span-4 flex flex-wrap gap-4"
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 hover:gap-5"
            >
              View Work
              <ArrowDownRight className="size-4 transition-transform group-hover:rotate-[-45deg]" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300"
            >
              Let's Work Together
            </a>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="mt-24 border-y border-border py-6 overflow-hidden"
      >
        <div className="flex marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 text-2xl font-display">
              {["Branding", "Content", "Strategy", "Photography", "Videography", "Social Growth"].map((w) => (
                <span key={w} className="flex items-center gap-12">
                  <span className="text-muted-foreground hover:text-primary transition-colors">{w}</span>
                  <span className="size-1.5 rounded-full bg-primary/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
