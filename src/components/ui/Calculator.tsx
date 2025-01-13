import React, { useEffect, useState } from 'react';
import { Token } from '@/types/Tokens';
import Image from 'next/image';
import { fetchCryptoPrice } from '@/apis/chainLink';

interface CalculatorProps {
    token1: Token;
    token2: Token;
    feeRate: number;
    initialMax: number,
    initialMin: number,
    volume: number | null,
    liquidity: number,
}

const Calculator: React.FC<CalculatorProps> = ({ token1, token2, feeRate, initialMax, initialMin, volume, liquidity }) => {
    const [depositAmount, setDepositAmount] = useState(1000);
    const [fee, setFee] = useState<number | undefined>(undefined);
    const [initialFee, setInitialFee] = useState(0);
    const [minPrice, setMinPrice] = useState(initialMin);
    const [maxPrice, setMaxPrice] = useState(initialMax);
    const [t1CurrentPrice, setT1CurrentPrice] = useState(0);

    useEffect(() => {
        async function setupCalculator() {
            try {
                setT1CurrentPrice(await fetchCryptoPrice(token1.symbol));
                if (volume !== null) {
                    const initialMin = t1CurrentPrice - 0.9;
                    const initialMax = t1CurrentPrice + 0.9;
                    const rangeWidth = initialMax - initialMin;
                    const initialDepositAmount = 1000;
                    const marketRangeWidth = Math.max(initialMax, t1CurrentPrice) - Math.min(initialMin, t1CurrentPrice);
                    if (marketRangeWidth <= 0) {
                        setInitialFee(0);
                        return;
                    }
                    const volumeInRange = volume * (marketRangeWidth / rangeWidth);
                    const liquidityInRange = liquidity * (marketRangeWidth / rangeWidth);
                    const userLiquidityShare = initialDepositAmount / liquidityInRange;
                    const totalFeesGenerated = volumeInRange * (feeRate / 100);
                    setInitialFee(totalFeesGenerated * userLiquidityShare);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        setupCalculator();
    });

    function handlePricesChange(min: number, max: number, amount: number) {
        // TODO: implement liquidity by price range
        if (volume !== null && liquidity > 0 && !isNaN(min) && !isNaN(max)) {
            if (amount <= 0 || t1CurrentPrice <= 0 || volume <= 0 || min >= max) {
                setFee(0);
                return;
            }
    
            let marketRangeWidth = 0;
            if (t1CurrentPrice >= min && t1CurrentPrice <= max) {
                marketRangeWidth = t1CurrentPrice - min;
            }
    
            if (marketRangeWidth === 0) {
                setFee(0);
                return;
            }
    
            const rangeWidth = max - min;
            const volumeInRange = volume * (marketRangeWidth / rangeWidth);
            const tvlInRange = liquidity * (marketRangeWidth / rangeWidth);
            const userLiquidityShare = tvlInRange > 0 ? (amount / tvlInRange) : 0;
            const totalFeesGenerated = volumeInRange * (feeRate / 100);
            
            setFee(totalFeesGenerated * userLiquidityShare);
        }
    }    

    function onMinChange(min: number) {
        setMinPrice(min);
        handlePricesChange(min, maxPrice, depositAmount);
    }

    function onMaxChange(max: number) {
        setMaxPrice(max);
        handlePricesChange(minPrice, max, depositAmount);
    }

    function onDepositChange(amount: number) {
        setDepositAmount(amount);
        handlePricesChange(minPrice, maxPrice, amount);
    }

    return (
        <>
            {volume !== 0 &&
                <div className="bg-black text-white max-w-4xl mx-auto">
                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                                <Image src={token1.logo_url} width={20} height={20} alt={token1.symbol} className="rounded-full" />
                                <Image src={token2.logo_url} width={20} height={20} alt={token2.symbol} className="rounded-full -ml-2" />
                            </div>
                            <span className="text-white">{token1.symbol} / {token2.symbol}</span>
                            <span className="text-gray-400">{feeRate}%</span>
                            <span className="text-gray-400 bg-zinc-800 px-2 py-0.5 rounded text-sm">Starknet</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3">
                        <div className="space-y-3">
                            <div className="bg-[#1E1E1E] rounded-lg p-3">
                                <div className="text-gray-400 text-sm">Estimated Fees (24h)</div>
                                <div className="text-2xl text-green-400 my-2">
                                    {fee === undefined ? '$' + initialFee.toFixed(2).toString() : '$' + fee.toFixed(2).toString()}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between bg-zinc-800 p-1.5 rounded text-xs">
                                        <span className="text-gray-400">MONTHLY</span>
                                        <div className="flex space-x-2">
                                            <span>
                                                {fee === undefined ? '$' + (initialFee * 30).toFixed(2).toString() : '$' + (fee * 30).toFixed(2).toString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between bg-zinc-800 p-1.5 rounded text-xs">
                                        <span className="text-gray-400">YEARLY (APR)</span>
                                        <div className="flex space-x-2">
                                            {fee === undefined ? '$' + (initialFee * 365).toFixed(2).toString() : '$' + (fee * 365).toFixed(2).toString()}
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-2 text-center py-1 text-xs text-gray-400 hover:text-white transition-colors">
                                    Calculate Impermanent Loss
                                </button>
                            </div>

                            <div className="bg-[#1E1E1E] rounded-lg p-3">
                                <h2 className="text-base mb-2">Deposit Amount</h2>
                                <div className="bg-zinc-900 rounded-lg p-2 mb-2">
                                    <div className="flex items-center text-lg">
                                        <span className="text-white mr-2">$</span>
                                        <input
                                            type="number"
                                            value={depositAmount}
                                            onChange={(e) => onDepositChange(Number(e.target.value))}
                                            className="bg-transparent text-white w-full outline-none text-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    {[token1, token2].map((token) => (
                                        <div key={token.symbol} className="flex items-center justify-between bg-zinc-800 p-2 rounded text-xs">
                                            <div className="flex items-center gap-1">
                                                <Image src={token.logo_url} width={16} height={16} alt={token.symbol} className="rounded-full" />
                                                <span>{token.symbol}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span>500.35002</span>
                                                <span>$500.14</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-base">Price Range</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 my-2">
                                        <div className="bg-zinc-900 p-2 rounded-lg text-center">
                                            <span className="block text-gray-400 text-xs mb-1">Min Price</span>
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => onMinChange(Number(e.target.value))}
                                                className="bg-transparent text-white w-full outline-none text-xl"
                                            />
                                            <span className="block text-xs text-gray-400 mt-1">{token1.symbol} per {token2.symbol}</span>
                                        </div>
                                        <div className="bg-zinc-900 p-2 rounded-lg text-center">
                                            <span className="block text-gray-400 text-xs mb-1">Max Price</span>
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => onMaxChange(Number(e.target.value))}
                                                className="bg-transparent text-white w-full outline-none text-xl"
                                            />
                                            <span className="block text-xs text-gray-400 mt-1">{token1.symbol} per {token2.symbol}</span>
                                        </div>
                                    </div>
                                    {/* TODO: implement this */}
                                    {/* <div className="bg-zinc-900 rounded-lg p-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <button className="text-lg">-</button>
                                            <span className="text-gray-400 text-xs">Most Active Price Assumption</span>
                                            <button className="text-lg">+</button>
                                        </div>
                                        <div className="text-center mb-2">
                                            <span className="text-sm">0.0000105968674349596</span>
                                            <span className="block text-xs text-gray-400">{token1.symbol} per {token2.symbol}</span>
                                        </div>
                                        <div className="relative h-1 bg-zinc-800 rounded-full">
                                            <div className="absolute w-2 h-2 bg-pink-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                    </div> */}
                                </div>

                                <button className="w-full mt-3 border bg-white hover:bg-black text-black hover:text-white hover:border hover:border-white rounded-lg p-2 flex items-center justify-center gap-1 transition-colors duration-500 text-xs">
                                    Create Position on Ekubo
                                    <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* TODO: implement charts */}
                        <div className="col-span-2 space-y-3">
                            <div className="bg-[#1E1E1E] rounded-lg p-3">
                                <h2 className="text-base mb-2">Liquidity Position</h2>
                                <div className="h-40 bg-zinc-900 rounded-lg">
                                    {/* Chart placeholder */}
                                </div>
                            </div>

                            <div className="bg-[#1E1E1E] rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">{token1.symbol} / {token2.symbol}</span>
                                        <div className="flex space-x-1">
                                            <button className="px-1.5 py-0.5 rounded bg-zinc-800 text-xs">1D</button>
                                            <button className="px-1.5 py-0.5 rounded bg-zinc-800 text-xs">7D</button>
                                            <button className="px-1.5 py-0.5 rounded bg-blue-600 text-xs">1M</button>
                                            <button className="px-1.5 py-0.5 rounded bg-zinc-800 text-xs">3M</button>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs">Price: 0.00001060 WBTC / USDT</span>
                                </div>
                                <div className="h-40 bg-zinc-900 rounded-lg">
                                    {/* Chart placeholder */}
                                </div>
                                <div className="flex justify-between mt-2 text-gray-400 text-xs">
                                    <div>MIN 0.00000930</div>
                                    <div>MAX 0.00001091</div>
                                    <div>AVG 0.00001027</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Calculator;