'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { fetchTopPools, fetchUserFavPools } from '@/app/api/ekuboApi';
import { activeUser } from '@/state/user';
import { EkuboPoolsDisplay } from '@/types/EkuboPoolsDisplay';
import EkuboPoolsList from './EkuboPoolList';
import EkuboFavPoolsList from './EkuboFavPoolsList';
import { getPoolFeePercentage } from '@/lib/utils';
import { getVesuPools } from '@/app/api/vesuApi';

interface EkuboPoolsManagerProps {
	onError: (open: boolean) => void;
	selectedFee: string | null;
}

export default function EkuboPoolsManager({
	onError,
	selectedFee,
}: EkuboPoolsManagerProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [pools, setPools] = useState<EkuboPoolsDisplay[]>([]);
	const [isLoadingFavPools, setIsLoadingFavPools] = useState(true);
	const [processedFavPools, setProcessedFavPools] = useState<
		EkuboPoolsDisplay[]
	>([]);
	const user = useAtomValue(activeUser);

	useEffect(() => {
		async function getPools() {
			setIsLoading(true);
			setIsLoadingFavPools(true);
			try {
				const data = await fetchTopPools();
				const data2 = await getVesuPools();
				console.log(data2);
				setPools(data);
				setIsLoading(false);
				if (user) {
					const res = await axios.get(
						`/api/lumos/users?uId=${user?.uid}`
					);
					if (res.status == 200) {
						const userFavPoolsData = res.data.data.ekubo_fav_pools;
						const favPools =
							await fetchUserFavPools(userFavPoolsData);
						setProcessedFavPools(favPools);
					}
				} else {
					setProcessedFavPools([]);
				}
			} catch (err) {
				console.error(err);
				setProcessedFavPools([]);
			} finally {
				setIsLoading(false);
				setIsLoadingFavPools(false);
			}
		}
		getPools();
	}, [user]);

	const isPoolInFavorites = (pool: EkuboPoolsDisplay) => {
		if (!processedFavPools || processedFavPools.length === 0) return false;

		return processedFavPools.some(
			(favPool: EkuboPoolsDisplay) =>
				favPool.token0.symbol === pool.token0.symbol &&
				favPool.token1.symbol === pool.token1.symbol &&
				favPool.pool.fee === pool.pool.fee
		);
	};

	const handleToggleFavorite = async (poolItem: EkuboPoolsDisplay) => {
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
						},
					},
				});
				if (resp.status === 200) {
					setProcessedFavPools((prevFavs) =>
						prevFavs.filter(
							(favPool) =>
								!(
									favPool.token0.symbol ===
										poolItem.token0.symbol &&
									favPool.token1.symbol ===
										poolItem.token1.symbol &&
									favPool.pool.fee === poolItem.pool.fee
								)
						)
					);
				} else {
					onError(true);
				}
			} else {
				const newEkuboFavPool = {
					token0: poolItem.token0.symbol,
					token1: poolItem.token1.symbol,
					fee: poolItem.pool.fee,
					tickSpacing: poolItem.pool.tick_spacing,
				};

				const res = await axios.put('/api/lumos/users', {
					uId: user?.uid,
					protocol: 'EKUBO',
					newFavPool: newEkuboFavPool,
				});
				if (res.status === 200) {
					setProcessedFavPools((prevFavs) => [...prevFavs, poolItem]);
				} else {
					onError(true);
				}
			}
		} catch (error) {
			console.log(error);
			onError(true);
		}
	};

	const filteredPools = selectedFee
		? pools.filter(
				(pool) => getPoolFeePercentage(pool.pool.fee) === selectedFee
			)
		: pools;

	return {
		renderPoolsContent: () => (
			<EkuboPoolsList
				pools={filteredPools}
				isLoading={isLoading}
				selectedFee={selectedFee}
				isPoolInFavorites={isPoolInFavorites}
				handleToggleFavorite={handleToggleFavorite}
			/>
		),
		renderFavPoolsContent: () => (
			<EkuboFavPoolsList
				user={user}
				isLoadingFavPools={isLoadingFavPools}
				processedFavPools={processedFavPools}
				handleToggleFavorite={handleToggleFavorite}
			/>
		),
		favPoolsCount: processedFavPools.length,
		poolsCount: filteredPools.length,
	};
}
