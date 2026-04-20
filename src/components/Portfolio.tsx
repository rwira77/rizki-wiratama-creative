import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import workBranding from "@/assets/work-branding.jpg";
import workSocial from "@/assets/work-social.jpg";
import workPhoto from "@/assets/work-photo.jpg";
import workVideo from "@/assets/work-video.jpg";
import workEvent from "@/assets/work-event.jpg";
import workCampaign from "@/assets/work-campaign.jpg";

const categories = ["All", "Branding", "Social Media", "Photography", "Videography"];

const works = [
  {
    title: "Remlint Identity",
    cat: "Branding",
    img: workBranding,
    problem: "Generic, undifferentiated label",
    result: "Premium brand recall +210%",
    year: "2025",
    span: "md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    title: "Maison Editorial",
    cat: "Photography",
    img: workPhoto,
    problem: "Flat product imagery",
    result: "CTR +68% across paid",
    year: "2025",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    title: "Atelier Social System",
    cat: "Social Media",
    img: workSocial,
    problem: "Inconsistent feed, low engagement",
    result: "+340% followers in 9 months",
    year: "2024",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    title: "Runway 24 Campaign",
    cat: "Videography",
    img: workVideo,
    problem: "No video presence",
    result: "2.4M organic reach",
    year: "2024",
    span: "md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    title: "Soirée Activation",
    cat: "Branding",
    img: workEvent,
    problem: "Unmemorable launch event",
    result: "Sold-out collection in 48h",
    year: "2024",
    span: "md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    title: "Soft Form Campaign",
    cat: "Photography",
    img: workCampaign,
    problem: "Weak seasonal positioning",
    result: "+85% online sales QoQ",
    year: "2023",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
];

export const Portfolio = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? works : works.filter((w) => w.cat === filter);

  return (
    <section id="work" className="container py-32 md:py-44">
      <div className="grid md:grid-cols-12 gap-10 mb-16">
        <div className="md:col-span-7">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" /> Selected Work
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-balance">
            Case studies in <em className="text-primary not-italic">measurable</em> creative work.
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-sm px-5 py-2.5 rounded-full border transition-all duration-300 ${
              filter === c
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {filtered.map((w, i) => (
          <motion.a
            key={w.title}
            href="#contact"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: (i % 2) * 0.1 }}
            className={`group block ${w.span ?? "md:col-span-6"}`}
          >
            <div className={`relative overflow-hidden rounded-sm bg-muted ${w.aspect}`}>
              <img
                src={w.img}
                alt={`${w.title} — ${w.cat} case study`}
                loading="lazy"
                width={1024}
                height={1280}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">
                      {w.cat} · {w.year}
                    </p>
                    <h3 className="font-display text-2xl md:text-4xl font-light">{w.title}</h3>
                  </div>
                  <span className="size-12 rounded-full border border-foreground/30 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground group-hover:rotate-45">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 max-w-lg overflow-hidden">
                  <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Problem</p>
                    <p className="text-sm">{w.problem}</p>
                  </div>
                  <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    <p className="text-[10px] uppercase tracking-wider text-primary mb-1">Result</p>
                    <p className="text-sm">{w.result}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};
