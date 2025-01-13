import ProtocolCard from "@/components/ui/CalculatorCard";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";

export default function Calculators() {
  return (
    <div className="min-h-screen p-6">
      <Navbar />
      <div className="bg-black text-white p-8">
        <div className="max-w-6xl mx-48">
          <ProtocolCard imageSrc="/images/EkuboLogo.png" title="Ekubo Protocol" href="/calculators/ekubo"></ProtocolCard>
        </div>
      </div>
      <Footer />
    </div>
  );
}
