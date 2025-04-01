'use client';

import { useState } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { CircleHelp, Plus, RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { VesuEarnPosition, VesuBorrowPosition } from '@/types/VesuPositions';
import { CreatePositionModal } from './modals/CreateVesuPosition';

interface VesuPositionTableProps {
	earnPositions: VesuEarnPosition[] | undefined;
	borrowPositions: VesuBorrowPosition[] | undefined;
	isLoading: boolean;
	isWalletConnected: boolean;
	onCreatePosition?: (amount: number) => void;
	onRefresh?: () => void;
}

const headerTooltips = {
	Pool: 'The trading pool where your position is active',
	Type: 'The type of position (earn, borrowing, etc.)',
	Collateral: 'The asset you provided to this pool',
	'Total Supplied': "Total value of assets you've provided",
	Risk: 'Risk level associated based on utilization rate, higher utilization means higher risk on being liquidated',
	'Pool APY':
		'Annual percentage yield for this pool, this is the expected return on your investment over a year if the pool performs as expected',
	'Rewards APY':
		'Annual percentage yield for DeFi Spring Rewards, this will be rewards you will get weekly from Starknet DeFi Spring program',
};

const getRiskColorClass = (risk: string) => {
	switch (risk?.toLowerCase()) {
		case 'low':
			return 'bg-green-500/20 text-green-400';
		case 'medium':
			return 'bg-yellow-500/20 text-yellow-400';
		case 'high':
			return 'bg-red-500/20 text-red-400';
		default:
			return 'bg-gray-500/20 text-gray-400';
	}
};

export default function VesuPositionTable({
	earnPositions,
	borrowPositions,
	isLoading,
	isWalletConnected,
	onRefresh,
}: VesuPositionTableProps) {
	const [activeFilter, setActiveFilter] = useState<'all' | 'earn' | 'borrow'>(
		'all'
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = async () => {
		if (onRefresh && !isRefreshing) {
			setIsRefreshing(true);
			try {
				await onRefresh();
			} finally {
				// Reset the refreshing state after a short delay for better UX
				setTimeout(() => {
					setIsRefreshing(false);
				}, 500);
			}
		}
	};

	if (isLoading) {
		return (
			<div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
				<LoadingSpinner />
				<p className="text-gray-400">Loading your positions...</p>
			</div>
		);
	}

	if (!isWalletConnected) {
		return (
			<div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
				<p className="text-xl text-gray-400">
					Please connect your wallet to see your active positions.
				</p>
			</div>
		);
	}

	// Combine positions based on filter
	const allPositions = [];
	if (earnPositions && (activeFilter === 'all' || activeFilter === 'earn')) {
		allPositions.push(...earnPositions);
	}
	if (
		borrowPositions &&
		(activeFilter === 'all' || activeFilter === 'borrow')
	) {
		allPositions.push(...borrowPositions);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<button
						className={`px-6 py-3 rounded-full ${
							activeFilter === 'all'
								? 'bg-white/10 ring-1 ring-white/20 shadow-lg'
								: 'bg-white/5'
						}`}
						onClick={() => setActiveFilter('all')}
					>
						All Positions
					</button>
					<button
						className={`px-6 py-3 rounded-full ${
							activeFilter === 'earn'
								? 'bg-white/10 ring-1 ring-white/20 shadow-lg'
								: 'bg-white/5'
						}`}
						onClick={() => setActiveFilter('earn')}
					>
						Earn
					</button>
					{/* <button
            className={`px-4 py-2 rounded-lg ${
              activeFilter === 'borrow' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'
            }`}
            onClick={() => setActiveFilter('borrow')}
          >
            Borrow
          </button> */}
				</div>

				<div className="flex items-center space-x-3">
					<button
						onClick={handleRefresh}
						disabled={isRefreshing || isLoading}
						className="flex items-center gap-2 px-6 py-3 bg-[#1B1C1B] text-white border border-[#F0FFF6] font-medium rounded-full transition-all hover:bg-[#F0FFF6] hover:text-black duration-500"
					>
						<RefreshCw
							className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
						/>
						Refresh
					</button>
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 px-6 py-3 bg-[#1B1C1B] text-white border border-[#F0FFF6] font-medium rounded-full transition-all hover:bg-[#F0FFF6] hover:text-black duration-500"
					>
						<Plus className="w-4 h-4" />
						Create Position
					</button>
				</div>
			</div>

			{allPositions.length === 0 ? (
				<div className="bg-white/5 rounded-2xl p-12 text-center">
					<p className="text-xl text-gray-400">
						No {activeFilter !== 'all' ? activeFilter : ''}{' '}
						positions found
					</p>
				</div>
			) : (
				<div className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
					<TooltipProvider>
						<table className="w-full">
							<thead>
								<tr className="border-b border-white/10">
									{Object.entries(headerTooltips).map(
										([header, tooltip]) => (
											<th
												key={header}
												className="px-6 py-4 text-left"
											>
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-400">
														{header}
													</span>
													<Tooltip>
														<TooltipTrigger>
															<CircleHelp className="w-4 h-4 text-gray-500" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-sm">
																{tooltip}
															</p>
														</TooltipContent>
													</Tooltip>
												</div>
											</th>
										)
									)}
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{allPositions.map((position, index) => (
									<tr
										key={index}
										className="hover:bg-white/5 transition-colors"
									>
										<td className="px-6 py-4">
											<span className="text-indigo-400">
												{position.pool}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="px-3 py-1 rounded-full text-xs bg-white/10">
												{position.type}
											</span>
										</td>
										<td className="px-6 py-4">
											<span>{position.collateral}</span>
										</td>
										<td className="px-6 py-4">
											<span>
												$
												{position.total_supplied.toFixed(
													2
												)}
											</span>
										</td>
										<td className="px-6 py-4">
											{'risk' in position && (
												<span
													className={`px-3 py-1 rounded-full text-xs ${getRiskColorClass(position.risk)}`}
												>
													{position.risk}
												</span>
											)}
										</td>
										<td className="px-6 py-4">
											{'poolApy' in position && (
												<span className="text-green-400">
													{position.poolApy.toFixed(
														4
													)}
													%
												</span>
											)}
										</td>
										<td className="px-6 py-4">
											{'rewardsApy' in position && (
												<span className="text-green-400">
													{position.rewardsApy.toFixed(
														4
													)}
													%
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</TooltipProvider>
				</div>
			)}

			<CreatePositionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}
