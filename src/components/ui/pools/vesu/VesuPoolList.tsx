'use client';
import React from 'react';
import { Star, CircleHelp } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { VesuPoolDisplay } from '@/types/VesuPoolDisplay';
import { VesuAssetDisplay } from '@/types/VesuAssetDisplay';

interface VesuPoolsListProps {
	pools: VesuPoolDisplay[];
	isLoading: boolean;

	isPoolInFavorites: (pool: VesuPoolDisplay) => boolean;
	handleToggleFavorite: (poolItem: VesuPoolDisplay) => void;
}

export default function VesuPoolsList({
	pools,
	isLoading,
	isPoolInFavorites,
	handleToggleFavorite,
}: VesuPoolsListProps) {
	const getHighestUtilizationAsset = (assets: VesuAssetDisplay[]) => {
		if (!assets || assets.length === 0) return null;
		return assets.reduce(
			(highest, current) =>
				current.currentUtilization > highest.currentUtilization
					? current
					: highest,
			assets[0]
		);
	};

	const calculateAverageApy = (assets: VesuAssetDisplay[]) => {
		if (!assets || assets.length === 0) return 0;
		const validApys = assets.filter((asset) => asset.apy > 0);
		if (validApys.length === 0) return 0;
		const sum = validApys.reduce((total, asset) => total + asset.apy, 0);
		return sum / validApys.length;
	};

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
				<p className="text-xl text-gray-400">{'No pools found'}</p>
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
							<th className="px-6 py-4 text-left">Market Pool</th>
							<th className="px-6 py-4 text-left">
								<div className="flex items-center gap-2">
									Assets
									<Tooltip>
										<TooltipTrigger>
											<CircleHelp className="w-4 h-4 text-gray-400" />
										</TooltipTrigger>
										<TooltipContent>
											<p>Number of assets in this pool</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</th>
							<th className="px-6 py-4 text-left">
								<div className="flex items-center gap-2">
									Utilization
									<Tooltip>
										<TooltipTrigger>
											<CircleHelp className="w-4 h-4 text-gray-400" />
										</TooltipTrigger>
										<TooltipContent>
											<p>
												Highest utilization rate among
												pool assets
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</th>
							<th className="px-6 py-4 text-left">
								<div className="flex items-center gap-2">
									APY
									<Tooltip>
										<TooltipTrigger>
											<CircleHelp className="w-4 h-4 text-gray-400" />
										</TooltipTrigger>
										<TooltipContent>
											<p>
												Average APY for assets with
												non-zero rates
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</th>
							<th className="px-6 py-4 text-left">
								<div className="flex items-center gap-2">
									DeFi Spring APY
									<Tooltip>
										<TooltipTrigger>
											<CircleHelp className="w-4 h-4 text-gray-400" />
										</TooltipTrigger>
										<TooltipContent>
											<p>
												Highest DeFi Spring APY for pool
												assets
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{pools.map((pool) => {
							const highestUtilAsset = getHighestUtilizationAsset(
								pool.assets
							);
							const avgApy = calculateAverageApy(pool.assets);
							const highestDefiSpringApy = Math.max(
								...pool.assets.map(
									(asset) => asset.defiSpringApy || 0
								)
							);

							return (
								<tr
									key={pool.id}
									className="border-b border-white/5 hover:bg-white/5 transition-colors"
								>
									<td className="px-6 py-4">
										<button
											onClick={() =>
												handleToggleFavorite(pool)
											}
											className="transition-colors"
										>
											{isPoolInFavorites(pool) ? (
												<Star className="w-5 h-5 text-white fill-white" />
											) : (
												<Star className="w-5 h-5 text-gray-400 hover:text-white" />
											)}
										</button>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<div className="bg-blue-500/20 rounded-full w-8 h-8 flex items-center justify-center text-blue-300 font-bold">
												{pool.name.charAt(0)}
											</div>
											<span>{pool.name}</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-1">
											<span>{pool.assets.length}</span>
											<Tooltip>
												<TooltipTrigger>
													<CircleHelp className="w-4 h-4 text-gray-400" />
												</TooltipTrigger>
												<TooltipContent className="max-w-xs">
													<p className="font-bold mb-1">
														Assets:
													</p>
													<ul className="list-disc pl-4">
														{pool.assets.map(
															(asset, idx) => (
																<li key={idx}>
																	{
																		asset.symbol
																	}
																</li>
															)
														)}
													</ul>
												</TooltipContent>
											</Tooltip>
										</div>
									</td>
									<td className="px-6 py-4">
										{highestUtilAsset ? (
											<div className="flex items-center gap-1">
												<span>
													{highestUtilAsset.currentUtilization.toFixed(
														2
													)}
													%
												</span>
												<Tooltip>
													<TooltipTrigger>
														<CircleHelp className="w-4 h-4 text-gray-400" />
													</TooltipTrigger>
													<TooltipContent>
														<p>
															Highest utilization:{' '}
															{
																highestUtilAsset.symbol
															}
														</p>
													</TooltipContent>
												</Tooltip>
											</div>
										) : (
											'0.00%'
										)}
									</td>
									<td className="px-6 py-4">
										<div
											className={`${avgApy > 0 ? 'text-green-400' : ''}`}
										>
											{avgApy.toFixed(2)}%
										</div>
									</td>
									<td className="px-6 py-4">
										<div
											className={`${highestDefiSpringApy > 0 ? 'text-green-400' : ''}`}
										>
											{highestDefiSpringApy.toFixed(2)}%
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</TooltipProvider>
		</div>
	);
}
