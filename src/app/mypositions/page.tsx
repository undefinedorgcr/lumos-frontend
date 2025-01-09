'use client'

import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import Image from 'next/image'
import Link from 'next/link'; // Importamos Link de Next.js
import { useState } from "react";
import { Position } from "@/types/Position";

export default function MyPositions() {
  const protocols = ["Ekubo"];
  const [protocol, setProtocol] = useState("Ekubo");

  //TODO: Implement fetch hook
  const positions: Position[] = [
    {
      positionId: 10809,
      pool: {
        t1: "STRK",
        t2: "USDC",
      },
      poolHref: "https://app.ekubo.org/positions/new?baseCurrency=STRK&quoteCurrency=USDC",
      roi: 0.9,
      feeAPY: 11.8,
      liquidity: 22200,
      priceRange: {
        min: 0.45,
        max: 0.59
      },
      currentPrice: 0.45
    }
  ];

  function handleProtocolChange(pProtocol: string) {
    setProtocol(pProtocol)
  }

  return (
    <div className="min-h-screen p-6">
      <Navbar></Navbar>

      <div className="min-h-screen bg-black text-white p-8">
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

          {positions.length > 0 ? (
            <div className="border border-gray-500 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-500">
                    <th className="px-6 py-4 text-left text-sm font-normal">Position ID</th>
                    <th className="px-6 py-4 text-left text-sm font-normal">Pool</th>
                    <th className="px-6 py-4 text-left text-sm font-normal">ROI</th>
                    <th className="px-6 py-4 text-left text-sm font-normal">Fee APY</th>
                    <th className="px-6 py-4 text-left text-sm font-normal">Liquidity</th>
                    <th className="px-6 py-4 text-left text-sm font-normal">Price Range</th>
                    <th className="px-6 py-4 text-left text-sm font-normal">Current Price</th>
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
                          href={position.poolHref}
                          target="_blank" 
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          {position.pool.t1}/{position.pool.t2}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{position.roi}%</td>
                      <td className="px-6 py-4">{position.feeAPY}%</td>
                      <td className="px-6 py-4">${position.liquidity.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 1
                      })}k</td>
                      <td className="px-6 py-4">${position.priceRange.min}-{position.priceRange.max}</td>
                      <td className="px-6 py-4">${position.currentPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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