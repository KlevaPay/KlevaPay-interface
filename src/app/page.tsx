import { Hero, ProblemsSolution, PowerfulFeatures, WhoKleverPayIsFor, TestimonialsPartners, Pricing, Footer } from "@/ui/modules/block";
import { Navbar } from "@/ui/modules/partial/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemsSolution />
      <PowerfulFeatures />
      <WhoKleverPayIsFor />
      <TestimonialsPartners />
      <Pricing />
      <Footer />
    </main>
  );
}
