'use client';
import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { activeUser } from '@/state/user';
import { getVesuPools } from '@/app/api/vesuApi';
import { VesuPoolDisplay } from '@/types/VesuPoolDisplay';
import VesuPoolsList from './VesuPoolList';
import VesuFavPoolsList from './VesuFavPools';
import axios from 'axios';
import { VesuAssetDisplay } from '@/types/VesuAssetDisplay';

interface VesuPoolsManagerProps {
	onError: (open: boolean) => void;
}

export default function VesuPoolsManager({ onError }: VesuPoolsManagerProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [pools, setPools] = useState<VesuPoolDisplay[]>([]);
	const [isLoadingFavPools, setIsLoadingFavPools] = useState(true);
	const [processedFavPools, setProcessedFavPools] = useState<
		VesuPoolDisplay[]
	>([]);
	const user = useAtomValue(activeUser);

	useEffect(() => {
		async function getPools() {
			setIsLoading(true);
			setIsLoadingFavPools(true);
			try {
				const data = await getVesuPools();
				setPools(data);
				setIsLoading(false);
				if (user) {
					const res = await axios.get(
						`/api/lumos/users?uId=${user?.uid}`
					);

					if (res.status == 200 && res?.data?.data?.vesu_fav_pools) {
						const userFavPoolsData = res.data.data.vesu_fav_pools;
						const matchedFavPools = matchUserVesuFavPools(
							userFavPoolsData,
							data
						);
						setProcessedFavPools(matchedFavPools);
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

	const matchUserVesuFavPools = (
		favPoolsFromDb: VesuPoolDisplay[],
		allVesuPools: VesuPoolDisplay[]
	) => {
		const pools: Array<VesuPoolDisplay> = [];
		favPoolsFromDb.map(async (pool: VesuPoolDisplay) => {
			allVesuPools.forEach((poolData: VesuPoolDisplay) => {
				if (poolData.name == pool.name) {
					pools.push(poolData);
				}
			});
		});
		return pools;
	};

	const isPoolInFavorites = (pool: VesuPoolDisplay) => {
		if (!processedFavPools || processedFavPools.length === 0) return false;

		return processedFavPools.some(
			(favPool: VesuPoolDisplay) => favPool.name === pool.name
		);
	};

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

	const handleToggleFavorite = async (poolItem: VesuPoolDisplay) => {
		try {
			const isAlreadyFavorite = isPoolInFavorites(poolItem);

			if (isAlreadyFavorite) {
				const resp = await axios.delete('/api/lumos/users', {
					data: {
						uId: user?.uid,
						protocol: 'VESU',
						pool: {
							name: poolItem.name,
						},
					},
				});
				if (resp.status === 200) {
					setProcessedFavPools((prevFavs) =>
						prevFavs.filter(
							(favPool) => !(favPool.name === poolItem.name)
						)
					);
				} else {
					onError(true);
				}
			} else {
				const newVesuFavPool = {
					name: poolItem.name,
				};

				const res = await axios.put('/api/lumos/users', {
					uId: user?.uid,
					protocol: 'VESU',
					newFavPool: newVesuFavPool,
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

	return {
		renderPoolsContent: () => (
			<VesuPoolsList
				pools={pools}
				isLoading={isLoading}
				isPoolInFavorites={isPoolInFavorites}
				handleToggleFavorite={handleToggleFavorite}
				getHighestUtilizationAsset={getHighestUtilizationAsset}
				calculateAverageApy={calculateAverageApy}
			/>
		),
		renderFavPoolsContent: () => (
			<VesuFavPoolsList
				user={user}
				isLoadingFavPools={isLoadingFavPools}
				processedFavPools={processedFavPools}
				handleToggleFavorite={handleToggleFavorite}
				getHighestUtilizationAsset={getHighestUtilizationAsset}
				calculateAverageApy={calculateAverageApy}
			/>
		),
		favPoolsCount: processedFavPools.length,
		poolsCount: pools.length,
	};
}
