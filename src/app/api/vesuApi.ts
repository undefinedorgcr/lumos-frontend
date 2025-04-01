/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchCryptoPrice } from '@/lib/utils';
import { VesuPool } from '@/types/VesuPools';
import { VesuEarnPosition } from '@/types/VesuPositions';
import axios from 'axios';

export async function getEarnPositions(address: string) {
	if (!address) {
		return [];
	}
	const { data } = (
		await axios.get(
			`https://api.vesu.xyz/positions?walletAddress=${address}`
		)
	).data;
	const filteredData = data.filter(
		(item: { type: string }) => item.type === 'earn'
	);

	const pools = await getVesuPools();

	const vesuPositions: VesuEarnPosition[] = await Promise.all(
		filteredData.map(async (position: any) => {
			const poolData = pools.find(
				(pool: { id: any }) => pool.id === position.pool.id
			);
			let poolApy = 0;
			let rewardsApy = 0;
			let risk = 'Low';

			const tokenPrice = await fetchCryptoPrice(
				position.collateral.symbol
			);

			if (poolData) {
				const asset = poolData.assets.find(
					(asset: { symbol: any }) =>
						asset.symbol === position.collateral.symbol
				);
				if (asset) {
					poolApy = asset.apy;
					rewardsApy = asset.defiSpringApy;
					if (asset.currentUtilization > 80) {
						risk = 'High';
					} else if (asset.currentUtilization > 50) {
						risk = 'Medium';
					}
				}
			}

			return {
				poolId: position.pool.id,
				pool: position.pool.name,
				type: position.type,
				collateral: position.collateral.symbol,
				total_supplied:
					(Number(position.collateral.value) /
						10 ** position.collateral.decimals) *
					tokenPrice,
				risk,
				poolApy,
				rewardsApy,
			};
		})
	);
	console.log(vesuPositions);
	return vesuPositions;
}

export async function getVesuPools() {
	const { data } = (await axios.get(`https://api.vesu.xyz/pools`)).data;
	return data
		.filter((pool: any) => pool.isVerified)
		.map((pool: any) => ({
			id: pool.id,
			name: pool.name,
			address: pool.extensionContractAddress,
			assets: pool.assets.map((asset: any) => ({
				name: asset.name,
				symbol: asset.symbol,
				currentUtilization:
					(Number(asset.stats.currentUtilization.value) /
						10 ** Number(asset.stats.currentUtilization.decimals)) *
					100,
				apy:
					(Number(asset.stats.supplyApy.value) /
						10 ** Number(asset.stats.supplyApy.decimals)) *
					100,
				defiSpringApy:
					(Number(asset.stats.defiSpringSupplyApr?.value || 0) /
						10 **
							Number(
								asset.stats.defiSpringSupplyApr?.decimals || 0
							)) *
					100,
				decimals: asset.decimals,
				address: asset.address,
				vTokenAddress: asset.vToken.address,
			})),
		}));
}

export async function getBestVesuPool(
	token: string
): Promise<VesuPool | undefined> {
	const pools = await getVesuPools();
	let maxApy = 0;
	let bestPool = undefined;
	pools.forEach((pool: any) => {
		pool.assets.forEach((asset: any) => {
			if (asset.symbol === token) {
				const apy =
					(Number(asset.apy || 0) /
						10 ** Number(asset.decimals || 0)) *
					100;
				const defiSpringApy =
					(Number(asset.defiSpringSupplyApr || 0) /
						10 ** Number(asset.decimals || 0)) *
					100;
				const totalApy = apy + defiSpringApy;
				if (totalApy > maxApy) {
					maxApy = totalApy;
					bestPool = pool;
				}
			}
		});
	});
	return bestPool;
}

export async function getVesuTokens() {
	const { data } = (await axios.get(`https://api.vesu.xyz/tokens`)).data;

	return data;
}
