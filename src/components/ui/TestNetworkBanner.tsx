'use client';

import { walletStarknetkitLatestAtom } from "@/state/connectedWallet";
import { useAtomValue } from "jotai";

export default function TestNetworkBanner({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const wallet = useAtomValue(walletStarknetkitLatestAtom);

  return (
    <div className={`min-h-screen ${wallet?.chainId == "SN_SEPOLIA" ? 'border-4 border-blue-500 relative' : ''}`}>
      {wallet?.chainId == "SN_SEPOLIA" && (
        <div className="w-full text-center py-2 bg-blue-500 text-white font-bold">
          TestNet Mode - Sepolia Network
        </div>
      )}
      {children}
    </div>
  );
}