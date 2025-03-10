/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react';
import { Star} from 'lucide-react';
import Image from 'next/image';
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { fetchTopPools } from '@/app/api/ekuboApi';
import ErrorModal from '@/components/ui/modals/ErrorModal';
import { useAtomValue } from 'jotai';
import { activeUser } from '@/state/user';
import axios from 'axios';

export default function PoolOverview() {
    
    const [selectedFee, setSelectedFee] = useState<string | null>(null);
    const [openError, setOpenError] = useState(false);
    const user = useAtomValue(activeUser);

    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState<any[]>([]);

    const [isLoadingFavPools, setIsLoadingFavPools] = useState(true);
    const [favPools, setFavPools] = useState<any[]>([]);

    useEffect(() => {
        async function getPools() {
            setIsLoading(true);
            try {
                const data = await fetchTopPools();
                setPools(data);
            } catch (err) {
                console.error(err);
                setPools([]);
            } finally {
                setIsLoading(false);
            }
        }
        getPools();
    }, []);
    
    useEffect(() => {
        async function getFavPools() {
            setIsLoadingFavPools(true);
            try {
                if(user){
                    const res = await axios.get(`/api/lumos/users?uId=${user?.uid}`);
                    if (res.status == 200) {
                        setFavPools(res.data.data.ekubo_fav_pools);
                    }
                }else{
                    setFavPools([]);
                }

            } catch (err) {
                console.error(err);
                setFavPools([]);
            } finally {
                setIsLoadingFavPools(false);
            }
        }
        getFavPools();
    }, []);

    // Check if a pool is in favorites
    const isPoolInFavorites = (pool: any) => {
        if (!favPools || favPools.length === 0) return false;
        
        return favPools.some(favPool => 
            favPool.token0 === pool.token0.symbol && 
            favPool.token1 === pool.token1.symbol && 
            favPool.fee === pool.pool.fee
        );
    };

    const handleToggleFavorite = async (poolItem: any) => {
        try {
            const isAlreadyFavorite = isPoolInFavorites(poolItem);

            if (isAlreadyFavorite) {
                const resp = await axios.delete('/api/lumos/users', {
                    data: {
                        uId: user?.uid,
                        protocol: 'EKUBO',
                        pool: {
                            token0: poolItem.token0.symbol,
                            token1: poolItem.token1.symbol,
                            fee: poolItem.pool.fee,
                            tickSpacing: poolItem.pool.tick_spacing,
                        }
                    }
                });
                if(resp.status === 200){
                    setFavPools(prevFavs => 
                        prevFavs.filter(favPool => 
                            !(favPool.token0 === poolItem.token0.symbol && 
                              favPool.token1 === poolItem.token1.symbol && 
                              favPool.fee === poolItem.pool.fee)
                        )
                    );
                }else{
                    setOpenError(true);
                }
            } else {
                const newEkuboFavPool = {
                    token0: poolItem.token0.symbol,
                    token1: poolItem.token1.symbol,
                    fee: poolItem.pool.fee,
                    tickSpacing: poolItem.pool.tick_spacing,
                    token0LogoUrl: poolItem.token0.logo_url,
                    token1LogoUrl: poolItem.token1.logo_url,
                    totalFees: poolItem.totalFees,
                    totalTvl: poolItem.totalTvl,
                };
                
                const res = await axios.put('/api/lumos/users', {
                    uId: user?.uid,
                    protocol: 'EKUBO',
                    newFavPool: newEkuboFavPool
                });
                
                if (res.status === 200) {
                    setFavPools(prevFavs => [...prevFavs, newEkuboFavPool]);
                } else {
                    setOpenError(true);
                }
            }
        } catch (error: any) {
            console.log(error);
            setOpenError(true);
        }
    };

    function getTickSpacing(fee: number, tickSpacing: number) {
        const feeStr = (Number(fee) / Number(2 ** 128) * 100).toString();
        if (tickSpacing == 354892) {
            return "DCA-Enabled"
        }
        switch (feeStr) {
            case "0.01":
                return "0.02%"
            case "0.05":
                return "0.1%"
            case "0.3":
                return "0.6%"
            case "1":
                return "2%"
            case "5":
                return "10%"
        }
    }

    const getPoolFeePercentage = (fee: number): string => {
        return (Number(fee) / Number(2 ** 128) * 100).toFixed(2) + '%';
    };

    const filteredPools = selectedFee
        ? pools.filter(pool => getPoolFeePercentage(pool.pool.fee) === selectedFee)
        : pools;

    const renderPoolsContent = () => {

        if (isLoading) {
            return (
                <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
                    <LoadingSpinner />
                    <p className="text-gray-400">Loading pools...</p>
                </div>
            );
        }

        if (filteredPools.length === 0) {
            return (
                <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
                    <p className="text-xl font-light text-gray-400">
                        {selectedFee ? `No pools found with ${selectedFee} fee` : 'No pools found'}
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-white/5 rounded-2xl overflow-hidden">
                <TooltipProvider>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left">&nbsp;</th>
                                <th className="px-6 py-4 text-left">Pool</th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2">
                                        TVL (24h)
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <CircleHelp className="w-4 h-4 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Total Value Locked in the last 24 hours</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">Fees (24h)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPools.map((item, index) => (
                                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleToggleFavorite(item)} 
                                            className="transition-colors"
                                        >
                                        {isPoolInFavorites(item) ? (
                                        <Star className="w-5 h-5 text-white fill-white" />
                                        ) : (
                                        <Star className="w-5 h-5 text-gray-400 hover:text-white" />
                                        )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                <Image
                                                    src={item.token0.logo_url || "/images/EkuboLogo.png"}
                                                    width={24}
                                                    height={24}
                                                    alt={item.token0.symbol}
                                                    className="rounded-full"
                                                />
                                                <Image
                                                    src={item.token1.logo_url || "/images/EkuboLogo.png"}
                                                    width={24}
                                                    height={24}
                                                    alt={item.token1.symbol}
                                                    className="rounded-full"
                                                />
                                            </div>
                                            <span className="font-medium">
                                                {item.token0.symbol}/{item.token1.symbol}
                                            </span>
                                            <span className="text-blue-400 text-sm">
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        {getPoolFeePercentage(item.pool.fee)}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Pool fee</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </span>
                                            <span className="text-blue-400 text-sm">
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        {getTickSpacing(item.pool.fee, item.pool.tick_spacing)}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Pool tick spacing</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">${item.totalTvl.toFixed(2)}</td>
                                    <td className="px-6 py-4">${item.totalFees.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TooltipProvider>
            </div>
        );
    };

    const renderFavPoolsContent = () => {
        if (!user) {
            return (
                <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
                    <p className="text-xl font-light text-gray-400">
                        Your favorite pools are waiting! Log in to see them.
                    </p>
                </div>
            );
        }

        if (isLoadingFavPools) {
            return (
                <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
                    <LoadingSpinner />
                    <p className="text-gray-400">Loading favorite pools...</p>
                </div>
            );
        }
    
        if (favPools.length === 0) {
            return (
                <div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
                    <p className="text-xl font-light text-gray-400">
                        {`You don't have any favorite pools yet. Add your favorite pool collections by clicking the star icon.`}
                    </p>
                </div>
            );
        }
    
        return (
            <div className="bg-white/5 rounded-2xl overflow-hidden">
                <TooltipProvider>
                    <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <table className="w-full">
                            <thead>                                
                            <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-left ">&nbsp;</th>
                                    <th className="px-6 py-4 text-left">Pool</th>
                                    <th className="px-6 py-4 text-left ">
                                        <div className="flex items-center gap-2">
                                            TVL (24h)
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <CircleHelp className="w-4 h-4 text-gray-400" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Total Value Locked in the last 24 hours</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left ">Fees (24h)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {favPools.map((item, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => {
                                                    const poolStructure = {
                                                        token0: { symbol: item.token0, logo_url: item.token0LogoUrl },
                                                        token1: { symbol: item.token1, logo_url: item.token1LogoUrl },
                                                        pool: { fee: item.fee, tick_spacing: item.tickSpacing },
                                                        totalFees: item.totalFees,
                                                        totalTvl: item.totalTvl
                                                    };
                                                    handleToggleFavorite(poolStructure);
                                                }} 
                                                className="transition-colors"
                                            >
                                            <Star className="w-5 h-5 text-white fill-white" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    <Image
                                                        src={item.token0LogoUrl || "/images/EkuboLogo.png"}
                                                        width={24}
                                                        height={24}
                                                        alt={item.token0}
                                                        className="rounded-full"
                                                    /> 
                                                    <Image
                                                        src={item.token1LogoUrl || "/images/EkuboLogo.png"}
                                                        width={24}
                                                        height={24}
                                                        alt={item.token1}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <span className="font-medium">
                                                    {item.token0}/{item.token1}
                                                </span>
                                                <span className="text-blue-400 text-sm">
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                        {getPoolFeePercentage(item.fee)}
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Pool fee</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </span>
                                                <span className="text-blue-400 text-sm">
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                        {getTickSpacing(item.fee, item.tickSpacing)}
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Pool tick spacing</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">${item.totalTvl.toFixed(2)}</td>
                                        <td className="px-6 py-4">${item.totalFees.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TooltipProvider>
            </div>
        );
    };

    return (
        <div>
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-light">Pool Overview</h1>
                </div>

                <div className="space-y-6 mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl">Favorite Pools</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400">Total: {favPools.length} pool(s)</span>
                        </div>
                    </div>
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
                    {renderFavPoolsContent()}
                </div>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl">Top Pools</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400">Total: {filteredPools.length} pool(s)</span>
                        </div>
                    </div>
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
                    <div className="flex gap-2">
                        {['0.01%', '0.05%', '0.30%', '1.00%'].map(fee => (
                            <button
                                key={fee}
                                className={`px-4 py-2 rounded-lg transition-colors border ${selectedFee === fee
                                    ? 'bg-white/20 text-white border border-white'
                                    : 'bg-white/5 hover:bg-white/10 border-white/5'
                                    }`}
                                onClick={() => setSelectedFee(selectedFee === fee ? null : fee)}
                            >
                                {fee}
                            </button>
                        ))}
                    </div>
                    {renderPoolsContent()}
                </div>
            </main>
            <Footer />
            <ErrorModal isOpen={openError} onClose={setOpenError} title={'Oops!'} message={'Error updating favorite pools!'} />
        </div>
    );
}