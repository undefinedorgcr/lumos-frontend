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
import { UserAuth } from '@/types/UserAuth';

interface EkuboFavPoolsListProps {
	user: UserAuth | undefined; // O User | undefined si tienes el tipo User definido
	isLoadingFavPools: boolean;
	processedFavPools: EkuboPoolsDisplay[];
	handleToggleFavorite: (poolItem: EkuboPoolsDisplay) => void;
}

export default function EkuboFavPoolsList({
	user,
	isLoadingFavPools,
	processedFavPools,
	handleToggleFavorite,
}: EkuboFavPoolsListProps) {
	if (!user) {
		return (
			<div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
				<p className="text-xl text-gray-400">
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

	if (processedFavPools.length === 0 || processedFavPools === undefined) {
		return (
			<div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
				<p className="text-xl text-gray-400">
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
													Total Value Locked in the
													last 24 hours
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
								</th>
								<th className="px-6 py-4 text-left">
									Fees (24h)
								</th>
							</tr>
						</thead>
						<tbody>
							{processedFavPools.map(
								(favItem: EkuboPoolsDisplay, index: number) => {
									return (
										<tr
											key={index}
											className="border-b border-white/5 hover:bg-white/5 transition-colors"
										>
											<td className="px-6 py-4">
												<button
													onClick={() => {
														handleToggleFavorite(
															favItem
														);
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
															src={
																favItem?.token0
																	.logo_url ||
																'/images/EkuboLogo.png'
															}
															width={24}
															height={24}
															alt={
																favItem.token0
																	.symbol
															}
															className="rounded-full"
														/>
														<Image
															src={
																favItem?.token1
																	.logo_url ||
																'/images/EkuboLogo.png'
															}
															width={24}
															height={24}
															alt={
																favItem.token1
																	.symbol
															}
															className="rounded-full"
														/>
													</div>
													<span className="">
														{favItem.token0.symbol}/
														{favItem.token1.symbol}
													</span>
													<span className="text-blue-400 text-sm">
														<Tooltip>
															<TooltipTrigger>
																{getPoolFeePercentage(
																	favItem.pool
																		.fee
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
																	favItem.pool
																		.fee,
																	favItem.pool
																		.tick_spacing
																)}
															</TooltipTrigger>
															<TooltipContent>
																<p>
																	Pool tick
																	spacing
																</p>
															</TooltipContent>
														</Tooltip>
													</span>
												</div>
											</td>
											<td className="px-6 py-4">
												$
												{favItem.totalTvl
													? favItem.totalTvl.toFixed(
															2
														)
													: '0.00'}
											</td>
											<td className="px-6 py-4">
												$
												{favItem.totalFees
													? favItem.totalFees.toFixed(
															2
														)
													: '0.00'}
											</td>
										</tr>
									);
								}
							)}
						</tbody>
					</table>
				</div>
			</TooltipProvider>
		</div>
	);
}
