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
      } catch(err) {
        console.log(err);
        setPositions(undefined);
      } finally {
        setIsLoading(false);
      }
    }
    getPositions();
  }, [wallet?.account?.address]);

  function handleProtocolChange(pProtocol: string) {
    setProtocol(pProtocol)
  }

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
    <div className="min-h-screen p-6">
      <Navbar></Navbar>

      <div className="text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl mb-6">Select the protocol</h1>

          <div className="flex gap-4 mb-12">
            {protocols.map((p) => (
              <button 
                key={p}
                onClick={() => handleProtocolChange(p)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors
                  ${protocol === p ? 'bg-zinc-800' : 'bg-zinc-900'} 
                  ${protocol === p ? 'border border-white' : ''} 
                  hover:bg-zinc-700`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src={`/images/${p}Logo.png`}
                    width={30}
                    height={30}
                    alt={`${p} logo`}
                    className="pointer-events-none"
                  />
                </div>
                <span>{p}</span>
              </button>
            ))}
          </div>
            
          {isLoading ? (
            <div className="border border-gray-500 rounded-2xl p-12 text-center">
              <LoadingSpinner/>
              Loading postions...
            </div>
          ) : positions ? (
            <div className="border border-gray-500 rounded-2xl overflow-hidden">
              <TooltipProvider>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-500">
                      {Object.entries(headerTooltips).map(([header, tooltip]) => (
                        <th key={header} className="px-6 py-4 text-left text-sm font-normal">
                          <div className="flex items-center gap-2">
                            {header}
                            <Tooltip>
                              <TooltipTrigger>
                                <CircleHelp className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => (
                      <tr key={position.positionId} className="border-b border-gray-700">
                        <td className="px-6 py-4">
                          <Link 
                            href="https://app.ekubo.org/positions" 
                            target="_blank"
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            {position.positionId}
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
                        <td className="px-6 py-4">{position.roi.toFixed(2)}%</td>
                        <td className="px-6 py-4">{position.feeAPY.toFixed(2)}%</td>
                        <td className="px-6 py-4">${position.liquidity.toFixed(2)}</td>
                        <td className="px-6 py-4">${position.priceRange.min.toFixed(2)}-{position.priceRange.max.toFixed(2)}</td>
                        <td className="px-6 py-4">${position.currentPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TooltipProvider>
            </div>
          ) : (
            <div className="border border-gray-500 rounded-2xl p-12 flex items-center justify-center">
              <p className="text-xl text-gray-300">You do not have any active positions.</p>
            </div>
          )}
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
