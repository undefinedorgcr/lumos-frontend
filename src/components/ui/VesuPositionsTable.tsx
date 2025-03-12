'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export interface VesuPosition {
  pool: string;
  type: string;
  collateral: string;
  total_supplied: number;
}

interface VesuPositionTableProps {
  positions: VesuPosition[] | undefined;
  isLoading: boolean;
  isWalletConnected: boolean;
}

const headerTooltips = {
  "Pool": "The trading pool where your position is active",
  "Type": "The type of position (lending, borrowing, etc.)",
  "Collateral": "The asset used as collateral",
  "Total Supplied": "Total value of assets you've provided"
};

export default function VesuPositionTable({ 
  positions, 
  isLoading, 
  isWalletConnected 
}: VesuPositionTableProps) {
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
            {positions.map((position, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-indigo-400">{position.pool}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10">
                    {position.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span>{position.collateral}</span>
                </td>
                <td className="px-6 py-4">
                  <span>${position.total_supplied.toFixed(2)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TooltipProvider>
    </div>
  );
}
