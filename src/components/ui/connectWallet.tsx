/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import { walletStarknetkitLatestAtom } from "@/state/connectedWallet";
import { useAtom } from "jotai";
import { connect, disconnect } from "starknetkit";

export default function WalletConnector() {
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);

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
    <div>
      {wallet ? (
        <p className="text-lg text-gray-400 hover:text-white hover:cursor-pointer underline"
          onClick={handleDisconnect}>
          Disconnect Wallet
        </p>
      ) : (
        <p className="text-lg text-gray-400 hover:text-white hover:cursor-pointer underline"
          onClick={handleConnect}>
          Connect Wallet
        </p>
      )}
    </div>
  );
}