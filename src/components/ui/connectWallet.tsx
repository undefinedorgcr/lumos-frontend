"use client";
import Image from 'next/image'
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet";
import { useAtom } from "jotai";
import { connect, disconnect } from "starknetkit";

export default function WalletConnector() {
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);

  const handleConnect = async (event: any) => {
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
        <button className="text-xl font-neuethin bg-white text-black px-10 py-2 rounded-md flex items-center gap-2"
        onClick={handleDisconnect}
        >
          Log Out
        </button>
      ) : (
        <button className="text-xl font-neuethin bg-white text-black px-10 py-2 rounded-md flex items-center gap-2"
        onClick={handleConnect}
        >
            Login
            <Image
                src="/images/ArgentLogo.png"
                width={35}
                height={35}
                alt="Lumos app logo"
            />
        </button>
      )}
    </div>
  );
}