import { Hero, ProblemsSolution, PowerfulFeatures, WhoKlevaPayIsFor, TestimonialsPartners, Pricing, Footer } from "@/ui/modules/block";
import { Navbar } from "@/ui/modules/partial/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemsSolution />
      <PowerfulFeatures />
      <WhoKlevaPayIsFor />
      <TestimonialsPartners />
      <Pricing />
      <Footer />
    </main>
  );
}
