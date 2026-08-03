import { getProjects, getServices, getTestimonials, getStats, getSettings } from "@/lib/data";
import { CustomCursor } from "@/components/site/custom-cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Preloader } from "@/components/site/preloader";
import { Navigation } from "@/components/site/navigation";
import { Hero } from "@/components/site/hero";
import { StatsBar } from "@/components/site/stats-bar";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { Portfolio } from "@/components/site/portfolio";
import { Process } from "@/components/site/process";
import { Testimonials } from "@/components/site/testimonials";
import { TechStack } from "@/components/site/tech-stack";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { AdminPanel } from "@/components/site/admin-panel";

export default async function Home() {
  const [projects, services, testimonials, stats, settings] = await Promise.all([
    getProjects(),
    getServices(),
    getTestimonials(),
    getStats(),
    getSettings(),
  ]);

  const tagline =
    settings["site.tagline"] || "Digital Solutions That Elevate";

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0a0c]">
      {/* ambient noise overlay */}
      <div className="noise pointer-events-none fixed inset-0 z-[1]" />

      <CustomCursor />
      <ScrollProgress />
      <Preloader />
      <Navigation />

      <main className="relative z-10 flex-1 flex flex-col">
        <Hero />
        <StatsBar stats={stats} />
        <About tagline={tagline} />
        <Services services={services} />
        <Portfolio projects={projects} />
        <Process />
        <Testimonials testimonials={testimonials} />
        <TechStack />
        <Contact settings={settings} />
      </main>

      <Footer settings={settings} />
      <AdminPanel />
    </div>
  );
}
