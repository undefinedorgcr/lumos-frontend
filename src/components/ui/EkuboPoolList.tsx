'use client';
import React from 'react';
import { Star, CircleHelp } from 'lucide-react';
import Image from 'next/image';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getPoolFeePercentage, getTickSpacing } from '@/lib/utils';
import { EkuboPoolsDisplay } from '@/types/EkuboPoolsDisplay';

interface EkuboPoolsListProps {
	pools: EkuboPoolsDisplay[];
	isLoading: boolean;
	selectedFee: string | null;
	isPoolInFavorites: (pool: EkuboPoolsDisplay) => boolean;
	handleToggleFavorite: (poolItem: EkuboPoolsDisplay) => void;
}

export default function EkuboPoolsList({
	pools,
	isLoading,
	selectedFee,
	isPoolInFavorites,
	handleToggleFavorite,
}: EkuboPoolsListProps) {
	if (isLoading) {
		return (
			<div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
				<LoadingSpinner />
				<p className="text-gray-400">Loading pools...</p>
			</div>
		);
	}

	if (pools.length === 0) {
		return (
			<div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
				<p className="text-xl text-gray-400">
					{selectedFee
						? `No pools found with ${selectedFee} fee`
						: 'No pools found'}
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
											<p>
												Total Value Locked in the last
												24 hours
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</th>
							<th className="px-6 py-4 text-left">Fees (24h)</th>
						</tr>
					</thead>
					<tbody>
						{pools.map((item, index) => (
							<tr
								key={index}
								className="border-b border-white/5 hover:bg-white/5 transition-colors"
							>
								<td className="px-6 py-4">
									<button
										onClick={() =>
											handleToggleFavorite(item)
										}
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
												src={
													item.token0.logo_url ||
													'/images/EkuboLogo.png'
												}
												width={24}
												height={24}
												alt={item.token0.symbol}
												className="rounded-full"
											/>
											<Image
												src={
													item.token1.logo_url ||
													'/images/EkuboLogo.png'
												}
												width={24}
												height={24}
												alt={item.token1.symbol}
												className="rounded-full"
											/>
										</div>
										<span className="">
											{item.token0.symbol}/
											{item.token1.symbol}
										</span>
										<span className="text-blue-400 text-sm">
											<Tooltip>
												<TooltipTrigger>
													{getPoolFeePercentage(
														item.pool.fee
													)}
												</TooltipTrigger>
												<TooltipContent>
													<p>Pool fee</p>
												</TooltipContent>
											</Tooltip>
										</span>
										<span className="text-blue-400 text-sm">
											<Tooltip>
												<TooltipTrigger>
													{getTickSpacing(
														item.pool.fee,
														item.pool.tick_spacing
													)}
												</TooltipTrigger>
												<TooltipContent>
													<p>Pool tick spacing</p>
												</TooltipContent>
											</Tooltip>
										</span>
									</div>
								</td>
								<td className="px-6 py-4">
									${item.totalTvl.toFixed(2)}
								</td>
								<td className="px-6 py-4">
									${item.totalFees.toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</TooltipProvider>
		</div>
	);
}
