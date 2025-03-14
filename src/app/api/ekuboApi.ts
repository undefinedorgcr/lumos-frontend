/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contract, num } from 'starknet';
import axios, { AxiosError } from 'axios';
import pLimit from 'p-limit';
import { Token } from '@/types/Tokens';
import { Pool } from '@/types/Pool';
import { PoolState } from '@/types/PoolState';
import { EkuboPosition } from '@/types/Position';
import {
	fetchCryptoPrice,
	findActiveTick,
	getTicksInRange,
	normalizeHex,
	tickToPrice,
} from '@/lib/utils';
import { EKUBO_POSITIONS } from '@/abis/EkuboPositions';
import { TokenPriceCache } from '@/lib/cache/tokenPriceCache';
import { getAddresses, getNodeUrl, getProvider } from '@/constants';
import { EKUBO_CORE } from '@/abis/EkuboCore';
import { LiquidityData } from '@/types/LiquidityData';
import { EkuboPoolsDisplay } from '@/types/EkuboPoolsDisplay';

let walletString: string | null = '';
if (typeof window !== 'undefined') {
	walletString = window?.localStorage.getItem('walletStarknetkitLatest');
}
const wallet =
	walletString && walletString !== 'undefined'
		? JSON.parse(walletString)
		: undefined;
const chainId = wallet ? wallet?.chainId : 'SN_MAIN';
const BASE_URL =
	chainId == 'SN_MAIN'
		? 'https://mainnet-api.ekubo.org'
		: 'https://sepolia-api.ekubo.org';
const NODE_URL = getNodeUrl(chainId);
const tokenPriceCache = new TokenPriceCache(60000);

// TODO: implement this tokens
// export const TOP_TOKENS_SYMBOL = [
//   "STRK", "USDC", "ETH", "EKUBO", "DAI", "WBTC",
//   "USDT", "wstETH", "LORDS", "ZEND", "rETH", "UNI",
//   "NSTR", "CRM", "CASH", "xSTRK", "sSTRK", "kSTRK"
// ];

export const TOP_TOKENS_SYMBOL = ['STRK', 'USDC', 'ETH'];

const TOP_PAIRS = [
	{ token0: 'ETH', token1: 'USDC' },
	{ token0: 'STRK', token1: 'USDC' },
	{ token0: 'xSTRK', token1: 'STRK' },
	{ token0: 'LORDS', token1: 'ETH' },
	{ token0: 'USDC', token1: 'USDT' },
	{ token0: 'STRK', token1: 'ETH' },
	{ token0: 'STRK', token1: 'EKUBO' },
	{ token0: 'USDC', token1: 'EKUBO' },
	{ token0: 'WBTC', token1: 'ETH' },
	{ token0: 'LORDS', token1: 'STRK' },
	// { "token0": "STAM", "token1": "STRK" },
	{ token0: 'USDC', token1: 'DAI' },
	// { "token0": "CASH", "token1": "ETH" },
	{ token0: 'ETH', token1: 'EKUBO' },
	// { "token0": "NSTR", "token1": "STRK" },
	// { "token0": "DAIv0", "token1": "ETH" },
	// { "token0": "DAIv0", "token1": "USDC" },
	{ token0: 'wstETH', token1: 'ETH' },
	// { "token0": "CASH", "token1": "USDC" },
	{ token0: 'ETH', token1: 'USDT' },
	{ token0: 'WBTC', token1: 'USDC' },
];

const getTokenDecimals = (symbol: string): number =>
	symbol === 'USDC' || symbol === 'USDT' ? 6 : 18;

const formatTokenAmount = (amount: number | bigint, symbol: string): number => {
	const decimals = getTokenDecimals(symbol);
	return Number(amount) / 10 ** decimals;
};

const getFeeTickSpacing = (fee: string) => {
	switch (fee) {
		case '0.05':
			return {
				fee: BigInt('170141183460469235273462165868118016'),
				tickSpacing: 1000,
			};
		case '0.01':
			return {
				fee: BigInt('34028236692093847977029636859101184'),
				tickSpacing: 200,
			};
		case '0.3':
			return {
				fee: BigInt('1020847100762815411640772995208708096'),
				tickSpacing: 5982,
			};
		case '1':
			return {
				fee: BigInt('3402823669209384634633746074317682114'),
				tickSpacing: 19802,
			};
		case '5':
			return {
				fee: BigInt('17014118346046923173168730371588410572'),
				tickSpacing: 95310,
			};
	}
};

interface TokenMetadata {
	token0: string;
	token1: string;
	price1: number;
	price2: number;
	percentage1: number;
	percentage2: number;
}

const extractPositionMetadata = (input: string): TokenMetadata => {
	const [pair, prices, percentages] = input.split(' : ');
	const [token1, token0] = pair.split(' / ');
	const [price1, price2] = prices.split(' <> ');
	const [percentage1, percentage2] = percentages.split(' / ');

	return {
		token0,
		token1,
		price1: parseFloat(price1),
		price2: parseFloat(price2),
		percentage1: parseFloat(percentage1.replace('%', '')),
		percentage2: parseFloat(percentage2.replace('%', '')),
	};
};

// API Functions
export async function fetchTokens() {
	try {
		const { data } = await axios.get(`${BASE_URL}/tokens`);
		return data;
	} catch (error) {
		console.error('Error fetching tokens:', error);
		throw error;
	}
}

export async function fetchLatestPairVolume(
	t0: Token,
	t1: Token,
	t0price: number,
	t1price: number
): Promise<number> {
	try {
		const { data } = await axios.get(
			`${BASE_URL}/pair/${t0.l2_token_address}/${t1.l2_token_address}/volume`
		);

		const volume1 =
			formatTokenAmount(data.volumeByToken_24h[0].volume, t0.symbol) *
			t0price;
		const volume2 =
			formatTokenAmount(data.volumeByToken_24h[1].volume, t1.symbol) *
			t1price;

		return volume1 + volume2;
	} catch (error) {
		console.error('Error fetching pair volume:', error);
		throw error;
	}
}

export async function fetchPool(
	t0: Token,
	t1: Token,
	fee: number
): Promise<Pool | null> {
	try {
		const { data } = await axios.get(
			`${BASE_URL}/pair/${t0.l2_token_address}/${t1.l2_token_address}/pools`
		);

		const feeStr = getFeeTickSpacing(fee.toString())?.fee.toString();
		return (
			data.topPools.find(
				(pool: Pool) =>
					pool.fee.toString().slice(0, 16) === feeStr?.slice(0, 16)
			) || null
		);
	} catch (error) {
		console.error('Error fetching pool:', error);
		throw error;
	}
}

export async function fetchPoolByAddress(
	t0symbol: string,
	t1symbol: string
): Promise<Pool | null> {
	try {
		const { data } = await axios.get(
			`${BASE_URL}/pair/${t0symbol}/${t1symbol}/pools`
		);
		return data.topPools;
	} catch (error) {
		console.error('Error fetching pool by address:', error);
		return null;
	}
}

const sortPoolsByFees = (pools: any) => {
	return pools.sort((a: any, b: any) => {
		const sumA = BigInt(a.pool.fees0_24h) + BigInt(a.pool.fees1_24h);
		const sumB = BigInt(b.pool.fees0_24h) + BigInt(b.pool.fees1_24h);

		// Orden descendente: mayores sumas primero
		if (sumB > sumA) return 1;
		if (sumB < sumA) return -1;
		return 0;
	});
};

const limit = pLimit(5);

export async function fetchTopPools(): Promise<EkuboPoolsDisplay[]> {
	try {
		const pools: Array<any> = [];
		const tokens = await fetchTokens();

		await Promise.all(
			TOP_PAIRS.map(async (pair) => {
				const { data } = await axios.get(
					`${BASE_URL}/pair/${pair.token0}/${pair.token1}/pools`
				);
				data.topPools.forEach((pool: Pool) => {
					const t0 = tokens.find(
						(token: Token) =>
							token.symbol.toLowerCase() ===
							pair.token0.toLowerCase()
					);
					const t1 = tokens.find(
						(token: Token) =>
							token.symbol.toLowerCase() ===
							pair.token1.toLowerCase()
					);
					pools.push({
						token0: t0,
						token1: t1,
						pool: pool,
						totalFees: 0,
						totalTvl: 0,
					});
				});
			})
		);
		const sortedPools = sortPoolsByFees(pools).slice(0, 20);

		const updatedPools = await Promise.all(
			sortedPools.map((pool: any) =>
				limit(async () => {
					pool.totalFees = await valToUsd(
						pool.token0,
						pool.token1,
						pool.pool.fees0_24h,
						pool.pool.fees1_24h
					);
					pool.totalTvl = await valToUsd(
						pool.token0,
						pool.token1,
						pool.pool.tvl0_total,
						pool.pool.tvl1_total
					);
					return pool;
				})
			)
		);

		return sortPoolsByFees(updatedPools).slice(0, 20);
	} catch (error) {
		console.error('Error fetching top pairs:', error);
		throw error;
	}
}

export async function fetchUserFavPools(
	favPools: any[]
): Promise<EkuboPoolsDisplay[]> {
	try {
		const pools: Array<any> = [];
		const tokens = await fetchTokens();

		await Promise.all(
			favPools.map(async (pool: any) => {
				const { data } = await axios.get(
					`${BASE_URL}/pair/${pool.token0}/${pool.token1}/pools`
				);
				data.topPools.forEach((poolData: Pool) => {
					const t0 = tokens.find(
						(token: Token) =>
							token.symbol.toLowerCase() ===
							pool.token0.toLowerCase()
					);
					const t1 = tokens.find(
						(token: Token) =>
							token.symbol.toLowerCase() ===
							pool.token1.toLowerCase()
					);
					if (
						poolData.tick_spacing == pool.tickSpacing &&
						poolData.fee == pool.fee
					) {
						pools.push({
							token0: t0,
							token1: t1,
							pool: poolData,
							totalFees: 0,
							totalTvl: 0,
						});
					}
				});
			})
		);
		const sortedPools = sortPoolsByFees(pools).slice(0, 20);

		const updatedPools = await Promise.all(
			sortedPools.map((pool: any) =>
				limit(async () => {
					pool.totalFees = await valToUsd(
						pool.token0,
						pool.token1,
						pool.pool.fees0_24h,
						pool.pool.fees1_24h
					);
					pool.totalTvl = await valToUsd(
						pool.token0,
						pool.token1,
						pool.pool.tvl0_total,
						pool.pool.tvl1_total
					);
					return pool;
				})
			)
		);

		return sortPoolsByFees(updatedPools).slice(0, 20);
	} catch (error) {
		console.error('Error fetching top pairs:', error);
		throw error;
	}
}

export async function fetchPoolKeyHash(
	t0: Token,
	t1: Token,
	fee: number
): Promise<PoolState | undefined> {
	try {
		const { data } = await axios.get(`${BASE_URL}/pools`);
		const feeStr = getFeeTickSpacing(fee.toString())?.fee.toString();
		const t0Address = normalizeHex(t0.l2_token_address).trim();
		const t1Address = normalizeHex(t1.l2_token_address).trim();

		return data.find(
			(poolInfo: PoolState) =>
				poolInfo.token0 === t0Address &&
				poolInfo.token0 === t1Address &&
				num.hexToDecimalString(poolInfo.fee).slice(0, 2) ===
					feeStr?.slice(0, 2)
		);
	} catch (error) {
		console.error('Error fetching pool key hash:', error);
		throw error;
	}
}

export async function valToUsd(
	t0: Token,
	t1: Token,
	amount0: number,
	amount1: number
): Promise<number> {
	try {
		let t0price = tokenPriceCache.get(t0.symbol);
		let t1price = tokenPriceCache.get(t1.symbol);
		if (t0price == null) {
			t0price = await fetchCryptoPrice(t0.symbol);
			tokenPriceCache.set(t0.symbol, t0price);
		}
		if (t1price == null) {
			t1price = await fetchCryptoPrice(t1.symbol);
			tokenPriceCache.set(t1.symbol, t1price);
		}

		const val1 = formatTokenAmount(amount0, t0.symbol) * t0price;
		const val2 = formatTokenAmount(amount1, t1.symbol) * t1price;

		return val1 + val2;
	} catch (error) {
		console.error('Error fetching USD price:', error);
		throw error;
	}
}

export async function fetchLiquidityInRange(
	minPrice: number,
	maxPrice: number,
	liquidityData: LiquidityData[]
): Promise<number | null> {
	let liquidity = 0;
	liquidityData.forEach(({ tick, liquidity_net }) => {
		if (minPrice <= Number(tick) && Number(tick) <= maxPrice) {
			liquidity += Number(liquidity_net);
		}
	});
	return Number(liquidity);
}

async function fetchPositionMetadata(positionId: string) {
	try {
		const { data } = await axios.get(`${BASE_URL}/${positionId}`);
		return data;
	} catch (error) {
		console.error('Error fetching position metadata:', error);
		throw error;
	}
}

export async function fetchPosition(address: string): Promise<EkuboPosition[]> {
	if (!address) return [];

	const ekuboPositionsContract = new Contract(
		EKUBO_POSITIONS,
		getAddresses(chainId).EKUBO_POSITIONS,
		getProvider(NODE_URL !== undefined ? NODE_URL : '')
	);

	try {
		const { data } = await axios.get(`${BASE_URL}/positions/${address}`);

		const positions = await Promise.all(
			data.data.map(async (position: any) => {
				const metadata = await fetchPositionMetadata(position.id);
				const extractedValues = extractPositionMetadata(metadata.name);

				const lowersign = position.bounds.lower < 0;
				const uppersign = position.bounds.upper < 0;

				const poolKey = {
					token0: position.pool_key.token0,
					token1: position.pool_key.token1,
					fee: BigInt(position.pool_key.fee),
					tick_spacing: BigInt(position.pool_key.tick_spacing),
					extension: position.pool_key.extension,
				};

				const bounds = {
					lower: {
						mag: Math.abs(position.bounds.lower),
						sign: lowersign,
					},
					upper: {
						mag: Math.abs(position.bounds.upper),
						sign: uppersign,
					},
				};

				const positionInfo =
					await ekuboPositionsContract.get_token_info(
						position.id,
						poolKey,
						bounds
					);

				const [token0Price, token1Price] = await Promise.all([
					fetchCryptoPrice(extractedValues.token0),
					fetchCryptoPrice(extractedValues.token1),
				]);

				const fee1 =
					formatTokenAmount(
						positionInfo.fees0,
						extractedValues.token0
					) * token0Price;
				const fee2 =
					formatTokenAmount(
						positionInfo.fees1,
						extractedValues.token1
					) * token1Price;
				const amount0 =
					formatTokenAmount(
						positionInfo.amount0,
						extractedValues.token0
					) * token0Price;
				const amount1 =
					formatTokenAmount(
						positionInfo.amount1,
						extractedValues.token1
					) * token1Price;

				const liquidity = amount0 + amount1;
				const roi = ((fee1 + fee2) / liquidity) * 100;
				const apy = (1 + roi / 365) * 365 - 1;

				return {
					positionId: position.id,
					pool: {
						t0: extractedValues.token0,
						t1: extractedValues.token1,
					},
					roi,
					feeAPY: apy,
					liquidity,
					priceRange: {
						min: extractedValues.price1,
						max: extractedValues.price2,
					},
					currentPrice: Number(token0Price),
				};
			})
		);

		return positions;
	} catch (error) {
		console.error(
			'Error fetching positions:',
			error instanceof AxiosError ? error.message : error
		);
		return [];
	}
}

export async function fetchLiquidityData(
	t0: Token,
	t1: Token,
	minPrice: number,
	maxPrice: number,
	fee: number
): Promise<LiquidityData[] | null> {
	const feeTickSpacing = getFeeTickSpacing(fee.toString());
	if (feeTickSpacing == null) return null;

	try {
		const { data } = await axios.get(
			`${BASE_URL}/tokens/${t0.l2_token_address}/${t1.l2_token_address}/liquidity`
		);
		const minTick = findActiveTick(
			minPrice - minPrice * 0.18,
			data.data,
			t0,
			t1
		);
		const maxTick = findActiveTick(
			maxPrice + maxPrice * 0.18,
			data.data,
			t0,
			t1
		);
		const ticks: number[] = getTicksInRange(
			minTick,
			maxTick,
			data.data,
			feeTickSpacing.tickSpacing
		);
		const pool = {
			token0: t0.l2_token_address,
			token1: t1.l2_token_address,
			fee: feeTickSpacing.fee,
			tick_spacing: feeTickSpacing.tickSpacing,
			extension: 0,
		};
		const ekuboCoreContract = new Contract(
			EKUBO_CORE,
			getAddresses(chainId).EKUBO_CORE,
			getProvider(NODE_URL !== undefined ? NODE_URL : '')
		);
		console.log(ekuboCoreContract);
		const batchSize = 125;
		const delayMs = 1000;
		const limit = pLimit(125);
		const liquidityData: LiquidityData[] = [];
		for (let i = 0; i < ticks.length; i += batchSize) {
			const batchTicks = ticks.slice(i, i + batchSize);
			const batchResults = await Promise.all(
				batchTicks.map((tick: number) =>
					limit(async () => {
						const index = {
							mag: Math.abs(tick),
							sign: tick > 0 ? false : true,
						};
						const liquidity =
							await ekuboCoreContract.get_pool_tick_liquidity_net(
								pool,
								index
							);
						const price =
							tickToPrice(tick) *
							10 ** (t0.decimals - t1.decimals);
						if (liquidity > 0) {
							return {
								tick:
									price > 999
										? price.toFixed(2)
										: price.toFixed(6),
								liquidity_net: liquidity.toString(),
							};
						}
						return null;
					})
				)
			);
			liquidityData.push(
				...batchResults.filter((d): d is LiquidityData => d !== null)
			);
			if (i + batchSize < ticks.length) {
				await new Promise((resolve) => setTimeout(resolve, delayMs));
			}
		}

		return liquidityData;
	} catch (error) {
		console.error('Error fetching liquidity data:', error);
		return null;
	}
}
