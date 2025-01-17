'use client'
import { fetchLatestPairVolume, fetchTokens, fetchTvl, TOP_TOKENS_SYMBOL } from "@/apis/ekuboApi";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { Token } from "@/types/Tokens";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { TokenSelectorModal } from "@/components/ui/modals/TokenSelector";
import { ErrorModal } from "@/components/ui/modals/ErrorModal";
import Calculator from "@/components/ui/Calculator";
import { fetchCryptoPrice } from "@/apis/chainLink";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Calculators() {

    const [tokens, setTokens] = useState<Token[]>([]);
    const [fee, setFee] = useState(0);
    const [openTokenSelector, setOpenTokenSelector] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorDesc, setErrorDesc] = useState("");
    const [selectedToken, setSelectedToken] = useState(1);
    const [showCalculator, setShowCalculator] = useState(false);
    const [token0, setToken1] = useState<Token | undefined>(undefined);
    const [token1, setToken2] = useState<Token | undefined>(undefined);
    const [volume, setVolume] = useState<number | null>(null);
    const [initialPrice, setInitialPrice] = useState(0);
    const [poolLiquidity, setPoolLiquidity] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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

    async function handleContinue() {
        if (token0 == undefined || token1 == undefined) {
            setOpenError(true);
            setErrorTitle("Tokens not selected");
            setErrorDesc("Please select both tokens to continue to IL calculator");
        }
        else if (token0 == token1) {
            setOpenError(true);
            setErrorTitle("Tokens can not be the same");
            setErrorDesc("Please select different tokens to continue to IL calculator");
        }
        else {
            setIsLoading(true);
            setPoolLiquidity(await fetchTvl(token0, token1));
            setVolume(await fetchLatestPairVolume(token0, token1));
            setInitialPrice(await fetchCryptoPrice(token0.symbol));
            setShowCalculator(true);
            setIsLoading(false);
        };
    }

    return (
        <div className="min-h-screen p-6">
            <Navbar />
            {!showCalculator &&
                <div className="text-white p-8">
                    <div className="max-w-6xl mx-48">
                        {tokens != undefined && !isLoading &&
                            <div className="border border-white rounded-lg font-neue">
                                <div className="max-w-3xl mx-auto rounded-2xl p-8">
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
                                                    {<>{token0 == undefined ? "Select a token" : token0.symbol}</>}
                                                </button>
                                                <button className="text-center w-full bg-zinc-800 text-white py-3 px-4 rounded-lg flex items-center justify-between
                                                               hover:bg-zinc-500 transition duration-500"
                                                    onClick={() => handleTokenSelection(2)}>
                                                    {<>{token1 == undefined ? "Select a token" : token1.symbol}</>}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-white text-lg">Select Fee</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 0.01 ? 'border border-white bg-zinc-500' : ''}`}
                                                        onClick={() => handleFeePrecisionChange(0.01)}>
                                                        0.01% fee and 0.02% precision
                                                    </button>
                                                    <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 0.3 ? 'border border-white bg-zinc-500' : ''}`}
                                                        onClick={() => handleFeePrecisionChange(0.3)}>
                                                        0.3% fee and 0.6% precision
                                                    </button>
                                                    <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 5 ? 'border border-white bg-zinc-500' : ''}`}
                                                        onClick={() => handleFeePrecisionChange(5)}>
                                                        5% fee and 10% precision
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 0.05 ? 'border border-white bg-zinc-500' : ''}`}
                                                        onClick={() => handleFeePrecisionChange(0.05)}>
                                                        0.05% fee and 0.1% precision
                                                    </button>
                                                    <button className={`w-full bg-zinc-800 text-white py-3 px-4 rounded-lg text-center
                                                                   hover:bg-zinc-500 transition duration-500
                                                                   ${fee == 1 ? 'border border-white bg-zinc-500' : ''}`}
                                                        onClick={() => handleFeePrecisionChange(1)}>
                                                        1% fee and 2% precision
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center mt-8">
                                            <button className="bg-white text-black px-12 py-3 rounded-lg font-medium"
                                                onClick={() => handleContinue()}>
                                                Calculate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {isLoading &&
                            <div className= "max-w-6xl mx-48">
                                <div className="text-center text-gray-400">
                                    <LoadingSpinner />
                                    Loading calculator...
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
            {showCalculator && token0 !== undefined && token1 !== undefined && !isLoading &&
                <Calculator token1={token0} token2={token1} feeRate={fee} initialPrice={initialPrice} volume={volume} liquidity={poolLiquidity}></Calculator>
            }
            <TokenSelectorModal
                isOpen={openTokenSelector}
                onClose={setOpenTokenSelector}
                onSelectToken={selectedToken == 1 ? setToken1 : setToken2}
                tokens={tokens}
                topTokens={TOP_TOKENS_SYMBOL}
            >
            </TokenSelectorModal>
            <ErrorModal isOpen={openError} onClose={setOpenError} title={errorTitle} message={errorDesc} ></ErrorModal>
            <Footer />
        </div>
    );
}
