"use client";
import StarField from "@/components/animations/starfield";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  items: {
    name: string;
    description: string;
  }[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, items }) => {
  return (
    <div className="relative z-10 rounded-lg border border-gray-800 bg-[#111111] p-8">
      <h3 className="text-2xl font-light text-white mb-8">{title}</h3>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-0.5 bg-gray-700 h-auto"></div>
            <div>
              <h4 className="text-white font-light mb-2">{item.name}</h4>
              <p className="text-gray-400 font-light">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function KnowMore() {
  const features = [
    {
      title: "Automated Liquidity Management for CLMM",
      items: [
        {
          name: "Dynamic Range Adjustment",
          description:
            "Automatically adjusts the liquidity range based on real-time market conditions.",
        },
        {
          name: "Rebalancing",
          description:
            "Monitors price movements and reallocates liquidity when assets move out of the initial range.",
        },
        {
          name: "Gas-Efficient Strategies",
          description:
            "Minimizes gas costs by bundling adjustments and only performing actions when cost-benefit analysis supports profitability.",
        },
      ],
    },
    {
      title: "Impermanent Loss (IL) Calculator",
      items: [
        {
          name: "Custom Inputs",
          description:
            "Users can input current pool data or fetch it directly from supported protocols.",
        },
        {
          name: "Detailed Reporting",
          description:
            "Provides a breakdown of IL, including fees earned, token price changes, and net impact.",
        },
        {
          name: "Historical Analysis",
          description:
            "Visualizes past IL trends based on market movements and user activity.",
        },
      ],
    },
    {
      title: "Pool Simulations (Full-Range & CLMM)",
      items: [
        {
          name: "Full-Range Pools",
          description:
            "Simulates traditional AMM strategies where liquidity is distributed across the entire price range.",
        },
        {
          name: "CLMM Pools",
          description:
            "Allows users to define specific price ranges and simulate performance in Uniswap v3 or similar platforms.",
        },
        {
          name: "Performance Metrics",
          description:
            "Provides APY predictions, fee generation estimates, and expected IL for each scenario.",
        },
        {
          name: "Scenario Analysis",
          description:
            "Users can compare strategies side-by-side to identify the most profitable approach.",
        },
      ],
    },
    {
      title: "Dashboard and Analytics",
      items: [
        {
          name: "Live Position Monitoring",
          description:
            "Displays current liquidity distribution, accumulated fees, and IL for active positions.",
        },
        {
          name: "Market Insights",
          description:
            "Shows price trends, volatility data, and volume metrics for supported pools.",
        },
        {
          name: "Notifications",
          description:
            "Alerts users when significant events occur, such as liquidity leaving a defined range or optimal rebalancing opportunities.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <Navbar></Navbar>
      <StarField></StarField>
      <div className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-4xl md:text-5xl font-light text-white mb-12">
          Advanced Liquidity Management Platform for CLMM Pools
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-6 font-light">
          Lumos empowers liquidity providers in DeFi ecosystems with advanced
          tools for optimizing positions in Concentrated Liquidity Market Maker
          pools.
        </p>

        <p className="text-gray-400 text-lg md:text-xl font-light">
          Maximize returns and minimize risk with our comprehensive suite of
          automated management tools.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
      <div className="flex justify-center gap-6 max-w-6xl mx-auto mt-12">
  <Link
    className="custom-button"
    href="/calculators"
  >
    Get started
  </Link>
  <Link
    className="custom-button"
    href="/"
  >
    See documentation
  </Link>
</div>
      <Footer></Footer>
    </div>
  );
}