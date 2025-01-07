/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from 'next/image'
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet";
import { useAtom } from "jotai";
import { connect, disconnect } from "starknetkit";
import { useState } from 'react';

export default function WalletConnector() {
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);
  
  const [isHover, setIsHover] = useState(false);

  function handleArgentLogoChange() {
      setIsHover(!isHover);
  }

  const handleConnect = async () => {
    try {
      const { wallet } = await connect({
        provider,
        modalMode: "alwaysAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Starknetkit example dapp",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });
      setWallet(wallet);
    } catch (e) {
      console.error(e);
      alert((e as any).message);
    }
  };

  const handleDisconnect = async (event: any) => {
    event.preventDefault();
    try {
      await disconnect();
      setWallet(undefined);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {wallet ? (
        <button className="text-xl font-neuethin bg-white text-black px-10 py-2 rounded-md flex items-center gap-2
                      hover:bg-[#FF875C] hover:text-white transition duration-500"
        onClick={handleDisconnect}
        >
          Log Out
        </button>
      ) : (
        <button 
            onMouseEnter={handleArgentLogoChange}
            onMouseLeave={handleArgentLogoChange}
            onClick={handleConnect}
            className="text-xl font-neuethin bg-white text-black px-10 py-2 rounded-md flex items-center gap-2
                      hover:bg-[#FF875C] hover:text-white transition duration-500"
        >
            Login
            {!isHover &&
                <Image
                    src="/images/ArgentLogo.png"
                    width={25}
                    height={25}
                    alt="Lumos app logo"
                    className="pointer-events-none"
                />
            }
            {isHover &&
                <Image
                    src="/images/LightArgentLogo.png"
                    width={25}
                    height={25}
                    alt="Lumos app logo"
                    className="pointer-events-none"
                />
            }
        </button>
      )}
    </div>
  );
}