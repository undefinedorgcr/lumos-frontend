'use client'

import Link from 'next/link';
import { EkuboPosition } from "@/types/Position";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface EkuboPositionTableProps {
  positions: EkuboPosition[] | undefined;
  isLoading: boolean;
  isWalletConnected: boolean;
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

export default function EkuboPositionTable({ 
  positions, 
  isLoading, 
  isWalletConnected 
}: EkuboPositionTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
        <LoadingSpinner />
        <p className="text-gray-400">Loading your positions...</p>
      </div>
    );
  }

  if (!isWalletConnected) {
    return (
      <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
        <p className="text-xl font-light text-gray-400">Please connect your wallet to see your active positions.</p>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
        <p className="text-xl font-light text-gray-400">No active positions found</p>
      </div>
    );
  }

  return (
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
                    href={`https://app.ekubo.org/positions/new?baseCurrency=${position.pool.t0}&quoteCurrency=${position.pool.t1}`}
                    target="_blank"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {position.pool.t0}/{position.pool.t1}
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
  );
}
