import React, { useEffect, useState } from 'react';
import { Token } from '@/types/Tokens';
import Image from 'next/image';
import { fetchLiquidityInRange } from '@/apis/ekuboApi';
import { fetchCryptoPrice } from '@/apis/pragma';
import { calculateDepositAmounts } from '@/lib/utils';

interface CalculatorProps {
    token0: Token;
    token1: Token;
    feeRate: number;
    initialPrice: number;
    volume: number | null;
    liquidity: number;
}

const Calculator = ({ token0, token1, feeRate, initialPrice, volume }: CalculatorProps) => {
    const [depositAmount, setDepositAmount] = useState(0);
    const [fee, setFee] = useState<number>(0);
    const [minPrice, setMinPrice] = useState(Number((initialPrice - initialPrice * 0.06).toFixed(6)));
    const [maxPrice, setMaxPrice] = useState(Number((initialPrice + initialPrice * 0.06).toFixed(6)));
    const [t0CurrentPrice, sett0CurrentPrice] = useState(0);
    const [t1CurrentPrice, sett1CurrentPrice] = useState(0);
    const [depositAmounts, setDepositAmounts] = useState([0, 0]);
    const [priceRangePercentage, setPriceRangePercentage] = useState(6);

    useEffect(() => {
        async function setupCalculator() {
            try {
                sett0CurrentPrice(await fetchCryptoPrice(token0.symbol));
                sett1CurrentPrice(await fetchCryptoPrice(token1.symbol));
            } catch (err) {
                console.log(err);
            }
        }
        setupCalculator();
    }, [token0.symbol]);

    async function handlePricesChange(min: number, max: number, amount: number) {
        const currentLiquidity = await fetchLiquidityInRange(token0, token1, min, max);

        if (volume !== null && currentLiquidity != null) {
            if (amount <= 0 || t0CurrentPrice <= 0 || volume <= 0 || min >= max || currentLiquidity <= 0) {
                setFee(0);
                setDepositAmounts([0, 0]);
                return;
            }

            let marketRangeWidth = 0;
            if (t0CurrentPrice >= min && t0CurrentPrice <= max) {
                marketRangeWidth = t0CurrentPrice - min;
            }

            if (marketRangeWidth === 0) {
                setFee(0);
                setDepositAmounts([0, 0]);
                return;
            }

            const amounts = calculateDepositAmounts(min, max, t0CurrentPrice/t1CurrentPrice, amount);
            setDepositAmounts(amounts);
            const Pl = min / (10 ** (token0.decimals - token1.decimals));
            const Pu = max / (10 ** (token0.decimals - token1.decimals));
            const liquidityAmount0 = (amounts[0] * 10 ** token0.decimals) * (Math.sqrt(Pu) * Math.sqrt(Pl)) / (Math.sqrt(Pu) - Math.sqrt(Pl));
            const liquidityAmount1 = (amounts[1] * 10 ** token0.decimals) / (Math.sqrt(Pu) - Math.sqrt(Pl));
            const deltaL = Math.min(liquidityAmount0, liquidityAmount1);
            const fee = (feeRate / 100) * volume * (deltaL / (currentLiquidity + deltaL));
            setFee(fee);
        }
    }

    const handlePriceRangeChange = (value: number) => {
        setPriceRangePercentage(value);
        const min = Number((initialPrice - initialPrice * (value / 100)).toFixed(6));
        const max = Number((initialPrice + initialPrice * (value / 100)).toFixed(6));
        setMinPrice(min);
        setMaxPrice(max);
        handlePricesChange(min, max, depositAmount);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="p-4 border-b border-zinc-800">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <Image src={token0.logo_url} width={24} height={24} alt={token0.symbol} className="rounded-full" />
                            <Image src={token1.logo_url} width={24} height={24} alt={token1.symbol} className="rounded-full -ml-2" />
                        </div>
                        <span className="text-lg font-medium">{token0.symbol}/{token1.symbol}</span>
                        <span className="text-sm text-zinc-400">{feeRate}% Fee</span>
                        <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-400">Starknet</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-4">
                    <div className="space-y-6">
                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Estimated Returns</h3>
                                <span className="text-xs text-zinc-400">Based on 24h volume</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-zinc-800 rounded-lg p-3 text-center">
                                    <span className="text-xs text-zinc-400">Daily</span>
                                    <p className="text-lg font-medium text-green-400">
                                        ${fee.toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-zinc-800 rounded-lg p-3 text-center">
                                    <span className="text-xs text-zinc-400">Monthly</span>
                                    <p className="text-lg font-medium">
                                        ${(fee * 30).toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-zinc-800 rounded-lg p-3 text-center">
                                    <span className="text-xs text-zinc-400">Yearly (APR)</span>
                                    <p className="text-lg font-medium">
                                        ${(fee * 365).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
                            <h3 className="text-sm font-medium">Deposit Amount</h3>
                            <div className="bg-zinc-800 rounded-lg p-3 flex items-center space-x-2">
                                <span className="text-lg">$</span>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setDepositAmount(value);
                                        handlePricesChange(minPrice, maxPrice, value);
                                    }}
                                    className="bg-transparent w-full outline-none text-lg"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                {[token0, token1].map((token, index) => (
                                    <div key={token.symbol} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Image src={token.logo_url} width={20} height={20} alt={token.symbol} className="rounded-full" />
                                            <span>{token.symbol}</span>
                                        </div>
                                        <div className="text-right">
                                            <p>{(depositAmounts[index] / (index === 0 ? t0CurrentPrice : t1CurrentPrice)).toFixed(6)}</p>
                                            <p className="text-sm text-zinc-400">${depositAmounts[index].toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Price Range</h3>
                                <span className="text-xs text-zinc-400">{priceRangePercentage}% range</span>
                            </div>

                            <input
                                type="range"
                                value={priceRangePercentage}
                                onChange={(e) => handlePriceRangeChange(Number(e.target.value))}
                                min="1"
                                max="20"
                                step="1"
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-800 rounded-lg p-3">
                                    <span className="text-xs text-zinc-400">Min Price</span>
                                    <p className="text-lg font-medium">{minPrice.toFixed(6)}</p>
                                    <span className="text-xs text-zinc-400">{token1.symbol} per {token0.symbol}</span>
                                </div>
                                <div className="bg-zinc-800 rounded-lg p-3">
                                    <span className="text-xs text-zinc-400">Max Price</span>
                                    <p className="text-lg font-medium">{maxPrice.toFixed(6)}</p>
                                    <span className="text-xs text-zinc-400">{token1.symbol} per {token0.symbol}</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-white text-black hover:bg-zinc-200 rounded-lg p-3 font-medium flex items-center justify-center space-x-2 transition-colors">
                            <span>Create Position</span>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <h3 className="text-sm font-medium mb-4">Position Overview</h3>
                            <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
                                Price chart coming soon
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
