import { getProjects, getServices, getTestimonials, getStats, getSettings } from "@/lib/data";
import { CustomCursor } from "@/components/site/custom-cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { ScrollColorTransition } from "@/components/site/scroll-color-transition";
import { Preloader } from "@/components/site/preloader";
import { Navigation } from "@/components/site/navigation";
import { Hero } from "@/components/site/hero";
import { StatsBar } from "@/components/site/stats-bar";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { Portfolio } from "@/components/site/portfolio";
import { Process } from "@/components/site/process";
import { Testimonials } from "@/components/site/testimonials";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { AdminDashboard } from "@/components/site/admin-dashboard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const view = typeof params.view === "string" ? params.view : undefined;

  // Dedicated full-page admin dashboard — accessible at /?view=admin
  if (view === "admin") {
    return (
      <div className="relative min-h-screen bg-[#0a0a0c]">
        <CustomCursor />
        <ScrollProgress />
        <AdminDashboard />
      </div>
    );
  }

  const [projects, services, testimonials, stats, settings] = await Promise.all([
    getProjects(),
    getServices(),
    getTestimonials(),
    getStats(),
    getSettings(),
  ]);

  // `settings` now also drives the Hero + About/Story section copy
  // (hero.*, about.* keys — editable from the admin Settings tab).

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0a0c]">
      {/* ambient noise overlay */}
      <div className="noise pointer-events-none fixed inset-0 z-[1]" />

      <CustomCursor />
      <ScrollProgress />
      <ScrollColorTransition />
      <Preloader />
      <Navigation />

      <main className="relative z-10 flex-1 flex flex-col">
        <Hero settings={settings} />
        <StatsBar stats={stats} />
        <About settings={settings} />
        <Services services={services} />
        <Portfolio projects={projects} />
        <Process />
        <Testimonials testimonials={testimonials} />
        <Contact settings={settings} />
      </main>

      <Footer settings={settings} />
    </div>
  );
}
