import ProtocolCard from "@/components/ui/calculatorCard";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

export default function Calculators() {
  return (
    <div className="p-6">
      <div className="absolute" />
      <Navbar />

      <main className="relative px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-light text-white mb-4">
              DeFi Calculators
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Access powerful tools to analyze your liquidity positions, estimate yields, and optimize your DeFi strategy across different protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <ProtocolCard
              imageSrc="/images/EkuboLogo.png"
              title="Ekubo Protocol"
              description="Calculate impermanent loss, estimate yields, and optimize your concentrated liquidity positions in Ekubo pools."
              href="/calculators/ekubo"
            />
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-500 text-sm">
              More protocols coming soon...
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
