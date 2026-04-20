import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Experience } from "@/components/Experience";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Rizki Wiratama — Branding, Content & Marketing Strategy";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Rizki Wiratama — multi-disciplinary creative building brands that grow. Branding, content, photography, videography & marketing strategy from Jakarta, Indonesia."
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.origin + "/");

    const ldId = "ld-person";
    let ld = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = ldId;
      document.head.appendChild(ld);
    }
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Rizki Wiratama",
      jobTitle: "Branding Designer & Marketing Strategist",
      address: { "@type": "PostalAddress", addressCountry: "ID", addressLocality: "Jakarta" },
      knowsAbout: ["Branding", "Social Media", "Photography", "Videography", "Marketing Strategy"],
    });
  }, []);

  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Experience />
      <Clients />
      <Contact />
    </main>
  );
};

export default Index;
