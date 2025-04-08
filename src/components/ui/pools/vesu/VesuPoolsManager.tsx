'use client';
import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { activeUser } from '@/state/user';
import { getVesuPools } from '@/app/api/vesuApi';
import { VesuPoolDisplay } from '@/types/VesuPoolDisplay';
import VesuPoolsList from './VesuPoolList';

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
					console.log(user);
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

	const isPoolInFavorites = (pool: VesuPoolDisplay) => {
		if (!processedFavPools || processedFavPools.length === 0) return false;

		return processedFavPools.some(
			(favPool: VesuPoolDisplay) => favPool.name === pool.name
		);
	};

	const handleToggleFavorite = async (poolItem: VesuPoolDisplay) => {
		console.log(poolItem);
	};

	return {
		renderPoolsContent: () => (
			<VesuPoolsList
				pools={pools}
				isLoading={isLoading}
				isPoolInFavorites={isPoolInFavorites}
				handleToggleFavorite={handleToggleFavorite}
			/>
		),
		renderFavPoolsContent: () => (
			<VesuPoolsList
				pools={pools}
				isLoading={isLoading}
				isPoolInFavorites={isPoolInFavorites}
				handleToggleFavorite={handleToggleFavorite}
			/>
		),
		favPoolsCount: processedFavPools.length,
		poolsCount: pools.length,
	};
}
