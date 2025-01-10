'use client'
import { fetchTokens, TOP_TOKENS_SYMBOL } from "@/apis/ekuboApi";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { Token } from "@/types/Tokens";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { TokenSelectorModal } from "@/components/ui/modals/TokenSelector";

export default function Calculators() {

    const [tokens, setTokens] = useState<Token[]>([]);
    const [fee, setFee] = useState(0);
    const [openTokenSelector, setOpenTokenSelector] = useState(false);
    const [selectedToken, setSelectedToken] = useState(1);
    const [token1, setToken1] = useState<Token | undefined>(undefined);
    const [token2, setToken2] = useState<Token | undefined>(undefined);

    useEffect(() => {
        async function getTokens() {
            try {
                setTokens(await fetchTokens());
            }
            catch (err) {
                console.log(err);
            }

        }
        getTokens();
    }, [setTokens]);

    function handleFeePrecisionChange(feePrecisionId: number) {
        setFee(feePrecisionId);
    }

    function handleTokenSelection(pTokenSelected: number) {
        setSelectedToken(pTokenSelected);
        setOpenTokenSelector(true);
    }

    return (
        <div className="min-h-screen p-6">
            <Navbar />
            <div className="bg-black text-white p-8">
                <div className="max-w-6xl mx-48">
                    {tokens != undefined &&
                        <div className="border border-white rounded-lg font-neue">
                            <div className="max-w-3xl mx-auto rounded-2xl bg-zinc-900/50 p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-800">
                                        <Image src={"/images/EkuboLogo.png"} alt={"Ekubo logo"} width={200} height={200} />
                                    </div>
                                    <h1 className="text-2xl text-white font-light">Ekubo Protocol Calculator</h1>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-white text-lg">Select Pair</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="text-center w-full bg-zinc-800 text-white py-3 px-4 rounded-lg flex items-center justify-between
                                                               hover:bg-zinc-500 transition duration-500"
                                                onClick={() => handleTokenSelection(1)}>
                                                { <>{token1 == undefined ? "Select a token" : token1.symbol}</> }
                                            </button>
                                            <button className="text-center w-full bg-zinc-800 text-white py-3 px-4 rounded-lg flex items-center justify-between
                                                               hover:bg-zinc-500 transition duration-500"
                                                onClick={() => handleTokenSelection(2)}>
                                                 { <>{token2 == undefined ? "Select a token" : token2.symbol}</> }
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-white text-lg">Select Fee</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 0 ? 'border border-white bg-zinc-500' : ''}`}
                                                    onClick={() => handleFeePrecisionChange(0)}>
                                                    0.01% fee and 0.02% precision
                                                </button>
                                                <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 1 ? 'border border-white bg-zinc-500' : ''}`}
                                                    onClick={() => handleFeePrecisionChange(1)}>
                                                    0.3% fee and 0.6% precision
                                                </button>
                                                <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 2 ? 'border border-white bg-zinc-500' : ''}`}
                                                    onClick={() => handleFeePrecisionChange(2)}>
                                                    5% fee and 10% precision
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 3 ? 'border border-white bg-zinc-500' : ''}`}
                                                    onClick={() => handleFeePrecisionChange(3)}>
                                                    0.05% fee and 0.1% precision
                                                </button>
                                                <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 4 ? 'border border-white bg-zinc-500' : ''}`}
                                                    onClick={() => handleFeePrecisionChange(4)}>
                                                    1% fee and 2% precision
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-8">
                                        <button className="bg-white text-black px-12 py-3 rounded-lg font-medium">
                                            Calculate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <TokenSelectorModal
                isOpen={openTokenSelector}
                onClose={setOpenTokenSelector}
                onSelectToken={selectedToken == 1 ? setToken1 : setToken2}
                tokens={tokens}
                topTokens={TOP_TOKENS_SYMBOL}
            >
            </TokenSelectorModal>
            <Footer />
        </div>
    );
}
