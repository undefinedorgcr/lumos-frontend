'use client'
import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";

export default function PoolOverview() {
    const dummyPools = [{
        id: 0,
        token0: "USDC",
        token1: "ETH",
        fee: "0.05%",
        feeAPY: "193.47%",
        risk: "SAFE",
        priceVolatility: "5.60%",
        tvl: "$174.55m",
        fees: "$87.49k"
    },
    {
        id: 1,
        token0: "USDC",
        token1: "ETH",
        fee: "0.05%",
        feeAPY: "193.47%",
        risk: "SAFE",
        priceVolatility: "5.60%",
        tvl: "$174.55m",
        fees: "$87.49k"
    }];

    return (
        <div>
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-light">Pool Overview</h1>
                </div>

                {/* TODO: implement a logic to save user's fav pools */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl">Favorite Pools</h2>
                        <span className="text-gray-400">Total: 0 pools</span>
                    </div>
                    <p className="text-gray-400">You don't have any favorite pools yet. Add your favorite pool collections by clicking the star icon.</p>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl">Top Pools</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400">Total: 1 pool(s)</span>
                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                                export csv <span>↓</span>
                            </button>
                        </div>
                    </div>
                    {/* Protocol Selection */}
                    <div className="flex flex-wrap gap-2">
                        {['Ekubo'].map(protocol => (
                            <button
                                key={protocol}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Image
                                    src={`/images/${protocol}Logo.png`}
                                    width={20}
                                    height={20}
                                    alt={`${protocol} logo`}
                                />
                                {protocol}
                            </button>
                        ))}
                    </div>
                    {/* TODO: implement a fee filter */}
                    <div className="flex gap-2">
                        {['0.01%', '0.05%', '0.25%', '0.3%', '1%'].map(fee => (
                            <button
                                key={fee}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {fee}
                            </button>
                        ))}
                    </div>
                    {/* TODO: implement data fetching from selected protocol */}
                    <div className="bg-white/5 rounded-2xl overflow-hidden">
                        <TooltipProvider>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left">&nbsp;</th>
                                        <th className="px-6 py-4 text-left">POOL</th>
                                        <th className="px-6 py-4 text-left">
                                            <div className="flex items-center gap-2">
                                                FEE APY
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <CircleHelp className="w-4 h-4 text-gray-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Annual Percentage Yield from trading fees</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left">RISK</th>
                                        <th className="px-6 py-4 text-left">PRICE VOLATILITY 1D</th>
                                        <th className="px-6 py-4 text-left">TVL</th>
                                        <th className="px-6 py-4 text-left">1D FEES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dummyPools.map((dummyPool) => (
                                        <tr key={dummyPool.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <button className="text-gray-400 hover:text-white transition-colors">
                                                    <Star className="w-5 h-5" />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        <Image src="/images/EkuboLogo.png" width={24} height={24} alt="USDC" className="rounded-full" />
                                                        <Image src="/images/EkuboLogo.png" width={24} height={24} alt="ETH" className="rounded-full" />
                                                    </div>
                                                    <span className="font-medium">USDC/ETH</span>
                                                    <span className="text-blue-400 text-sm">0.05%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-green-400">{dummyPool.feeAPY}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm">
                                                    {dummyPool.risk}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{dummyPool.priceVolatility}</td>
                                            <td className="px-6 py-4">{dummyPool.tvl}</td>
                                            <td className="px-6 py-4">{dummyPool.fees}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TooltipProvider>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
