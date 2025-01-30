'use client'

import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Position } from "@/types/Position";
import { fetchPosition } from "@/apis/ekuboApi";
import { useAtomValue } from "jotai";
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function MyPositions() {
  const protocols = ["Ekubo"];
  const [protocol, setProtocol] = useState("Ekubo");
  const [positions, setPositions] = useState<Position[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const wallet = useAtomValue(walletStarknetkitLatestAtom);

  useEffect(() => {
    async function getPositions() {
      setIsLoading(true);
      try {
        const data = await fetchPosition(wallet?.account?.address);
        setPositions(data);
      } catch (err) {
        console.log(err);
        setPositions(undefined);
      } finally {
        setIsLoading(false);
      }
    }
    getPositions();
  }, [wallet?.account?.address]);

  const headerTooltips = {
    "Position ID": "Unique identifier for your liquidity position",
    "Pool": "Trading pair where you've provided liquidity",
    "ROI": "Return on Investment - Total return percentage since position creation",
    "Fee APY": "Annual Percentage Yield from trading fees",
    "Liquidity": "Total value of assets you've provided to the pool",
    "Price Range": "Min and max prices where your position is active",
    "Current Price": "Current trading price of the token pair"
  };

  return (
    <div>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-light">My Positions</h1>
            <p className="text-gray-400">Manage your liquidity positions across protocols</p>
          </header>

          <div className="flex gap-4">
            {protocols.map((p) => (
              <button
                key={p}
                onClick={() => setProtocol(p)}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-full transition-all
                  ${protocol === p
                    ? 'bg-white/10 ring-1 ring-white/20 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <Image
                  src={`/images/${p}Logo.png`}
                  width={24}
                  height={24}
                  alt={`${p} logo`}
                  className="pointer-events-none"
                />
                <span className="font-light">{p}</span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
              <LoadingSpinner />
              <p className="text-gray-400">Loading your positions...</p>
            </div>
          ) : positions ? (
            <div className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
              <TooltipProvider>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {Object.entries(headerTooltips).map(([header, tooltip]) => (
                        <th key={header} className="px-6 py-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-normal text-gray-400">{header}</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <CircleHelp className="w-4 h-4 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">{tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {positions.map((position) => (
                      <tr key={position.positionId} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <Link
                            href="https://app.ekubo.org/positions"
                            target="_blank"
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            #{position.positionId}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`https://app.ekubo.org/positions/new?baseCurrency=${position.pool.t1}&quoteCurrency=${position.pool.t2}`}
                            target="_blank"
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            {position.pool.t1}/{position.pool.t2}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={position.roi >= 0 ? "text-green-400" : "text-red-400"}>
                            {position.roi.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400">{position.feeAPY.toFixed(2)}%</span>
                        </td>
                        <td className="px-6 py-4">${position.liquidity.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className="text-gray-400">
                            ${position.priceRange.min.toFixed(2)} - ${position.priceRange.max.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">${position.currentPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TooltipProvider>
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
              <p className="text-xl font-light text-gray-400">No active positions found</p>
              <Link
                href="/positions/new"
                className="inline-block px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full transition-colors"
              >
                Create New Position
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
