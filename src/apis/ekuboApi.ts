/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contract, num } from 'starknet';
import axios, { AxiosError } from 'axios';
import pLimit from 'p-limit';
import { Token } from '@/types/Tokens';
import { Pool } from '@/types/Pool';
import { PoolState } from '@/types/PoolState';
import { Position } from '@/types/Position';
import { normalizeHex, tickToPrice } from '@/lib/utils';
import { EKUBO_POSITIONS_MAINNET_ADDRESS, provider } from '@/constants';
import { EKUBO_POSITIONS } from '@/abis/EkuboPositions';
import { fetchCryptoPrice } from './pragma';
import { TokenPriceCache } from '@/lib/cache/tokenPriceCache';

const BASE_URL = "https://mainnet-api.ekubo.org";
const QUOTER_URL = "https://quoter-mainnet-api.ekubo.org";

const tokenPriceCache = new TokenPriceCache(60000);

// TODO: implement this tokens
// export const TOP_TOKENS_SYMBOL = [
//   "STRK", "USDC", "ETH", "EKUBO", "DAI", "WBTC",
//   "USDT", "wstETH", "LORDS", "ZEND", "rETH", "UNI",
//   "NSTR", "CRM", "CASH", "xSTRK", "sSTRK", "kSTRK"
// ];

export const TOP_TOKENS_SYMBOL = [
  "STRK", "USDC", "ETH"
];


const TOP_PAIRS = [
  { "token0": "ETH", "token1": "USDC" },
  { "token0": "STRK", "token1": "USDC" },
  { "token0": "xSTRK", "token1": "STRK" },
  { "token0": "LORDS", "token1": "ETH" },
  { "token0": "USDC", "token1": "USDT" },
  { "token0": "STRK", "token1": "ETH" },
  { "token0": "STRK", "token1": "EKUBO" },
  { "token0": "USDC", "token1": "EKUBO" },
  { "token0": "WBTC", "token1": "ETH" },
  { "token0": "LORDS", "token1": "STRK" },
  // { "token0": "STAM", "token1": "STRK" },
  { "token0": "USDC", "token1": "DAI" },
  // { "token0": "CASH", "token1": "ETH" },
  { "token0": "ETH", "token1": "EKUBO" },
  // { "token0": "NSTR", "token1": "STRK" },
  // { "token0": "DAIv0", "token1": "ETH" },
  // { "token0": "DAIv0", "token1": "USDC" },
  { "token0": "wstETH", "token1": "ETH" },
  // { "token0": "CASH", "token1": "USDC" },
  { "token0": "ETH", "token1": "USDT" },
  { "token0": "WBTC", "token1": "USDC" }
];

// Utility functions
const getTokenDecimals = (symbol: string): number =>
  symbol === "USDC" || symbol === "USDT" ? 6 : 18;

const formatTokenAmount = (amount: number | bigint, symbol: string): number => {
  const decimals = getTokenDecimals(symbol);
  return Number(amount) / 10 ** decimals;
};

const calculateFeeU128 = (fee: number): string => {
  const feeU128 = (fee * 2 ** 128) / 10 ** 37;
  return feeU128.toString().replace(".", "");
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

export async function fetchLatestPairVolume(t0: Token, t1: Token, t0price: number, t1price: number): Promise<number> {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/pair/${t0.l2_token_address}/${t1.l2_token_address}/volume`
    );

    const volume1 = formatTokenAmount(data.volumeByToken_24h[0].volume, t0.symbol) * t0price;
    const volume2 = formatTokenAmount(data.volumeByToken_24h[1].volume, t1.symbol) * t1price;

    return volume1 + volume2;
  } catch (error) {
    console.error('Error fetching pair volume:', error);
    throw error;
  }
}

export async function fetchPool(t0: Token, t1: Token, fee: number): Promise<Pool | null> {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/pair/${t0.l2_token_address}/${t1.l2_token_address}/pools`
    );

    const feeStr = calculateFeeU128(fee);
    return data.topPools.find((pool: Pool) =>
      pool.fee.toString().slice(0, 16) === feeStr.slice(0, 16)
    ) || null;
  } catch (error) {
    console.error('Error fetching pool:', error);
    throw error;
  }
}

export async function fetchPoolByAddress(t0symbol: string, t1symbol: string): Promise<Pool | null> {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/pair/${t0symbol}/${t1symbol}/pools`
    );
    return data.topPools;
  } catch (error) {
    console.log('Error fetching pool by address:', error);
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

export async function fetchTopPools() {
  try {
    const pools: Array<any> = [];
    const tokens = await fetchTokens();

    await Promise.all(
      TOP_PAIRS.map(async (pair) => {
        const { data } = await axios.get(
          `${BASE_URL}/pair/${pair.token0}/${pair.token1}/pools`
        );
        data.topPools.forEach((pool: Pool) => {
          const t0 = tokens.find((token: Token) => token.symbol.toLowerCase() === pair.token0.toLowerCase());
          const t1 = tokens.find((token: Token) => token.symbol.toLowerCase() === pair.token1.toLowerCase());
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
          pool.totalFees = (await valToUsd(
            pool.token0,
            pool.token1,
            pool.pool.fees0_24h,
            pool.pool.fees1_24h
          ));
          pool.totalTvl = (await valToUsd(
            pool.token0,
            pool.token1,
            pool.pool.tvl0_total,
            pool.pool.tvl1_total
          ));
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

export async function fetchPoolKeyHash(t0: Token, t1: Token, fee: number): Promise<PoolState | undefined> {
  try {
    const { data } = await axios.get(`${BASE_URL}/pools`);
    const feeStr = calculateFeeU128(fee);
    const t0Address = normalizeHex(t0.l2_token_address).trim();
    const t1Address = normalizeHex(t1.l2_token_address).trim();

    return data.find((poolInfo: PoolState) =>
      poolInfo.token0 === t0Address &&
      poolInfo.token0 === t1Address &&
      num.hexToDecimalString(poolInfo.fee).slice(0, 2) === feeStr.slice(0, 2)
    );
  } catch (error) {
    console.error('Error fetching pool key hash:', error);
    throw error;
  }
}

export async function valToUsd(t0: Token, t1: Token, amount0: number, amount1: number): Promise<number> {
  try {
    let t0price = tokenPriceCache.get(t0.symbol);
    let t1price = tokenPriceCache.get(t1.symbol);
    console.log("Cached t0Price: ", t0.symbol, t0price);
    console.log("Cached t1Price: ", t1.symbol, t1price);
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
  t0: Token,
  t1: Token,
  minPrice: number,
  maxPrice: number,
): Promise<number | null> {

  const liquidityMap: { [tick: number]: bigint } = {};

  let totalLiquidity = BigInt(0);
  try {
    const { data } = await axios.get(
      `${BASE_URL}/tokens/${t0.l2_token_address}/${t1.l2_token_address}/liquidity`
    );

    const liquidityData = data.data;

    liquidityData.sort((a: { tick: number; }, b: { tick: number; }) => a.tick - b.tick);

    liquidityData.forEach(({ tick, net_liquidity_delta_diff }: { tick: number, net_liquidity_delta_diff: number }) => {
      totalLiquidity += BigInt(net_liquidity_delta_diff);
      liquidityMap[tick] = totalLiquidity;
    });

    totalLiquidity = BigInt(0);

    for (const tick in liquidityMap) {
      const liquidity = liquidityMap[tick];
      const price = tickToPrice(Number(tick)) * (10 ** (t0.decimals - t1.decimals));
      if (price >= minPrice && price <= maxPrice) {
        totalLiquidity += liquidity;
      }
    };
    return Number(totalLiquidity);

  } catch (error) {
    console.error("Error fetching liquidity data:", error);
    return null;
  }
}



export async function getPrice(address: string): Promise<number> {
  try {
    const { data } = await axios.get(
      `${QUOTER_URL}/prices/0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8`
    );

    const priceInfo = data.prices.find((item: { token: string }) => item.token === address);
    return priceInfo?.price ?? 0;
  } catch (error) {
    console.error('Error fetching price:', error);
    throw error;
  }
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

export async function fetchPosition(address: string): Promise<Position[]> {
  if (!address) return [];

  const ekuboPositionsContract = new Contract(EKUBO_POSITIONS, EKUBO_POSITIONS_MAINNET_ADDRESS, provider);

  try {
    const { data } = await axios.get(`${BASE_URL}/positions/${address}`);

    const positions = await Promise.all(data.data.map(async (position: any) => {
      const metadata = await fetchPositionMetadata(position.id);
      const extractedValues = extractPositionMetadata(metadata.name);

      const lowersign = position.bounds.lower < 0;
      const uppersign = position.bounds.upper < 0;

      const poolKey = {
        token0: position.pool_key.token0,
        token1: position.pool_key.token1,
        fee: BigInt(position.pool_key.fee),
        tick_spacing: BigInt(position.pool_key.tick_spacing),
        extension: position.pool_key.extension
      };

      const bounds = {
        lower: { mag: Math.abs(position.bounds.lower), sign: lowersign },
        upper: { mag: Math.abs(position.bounds.upper), sign: uppersign }
      };

      const positionInfo = await ekuboPositionsContract.get_token_info(position.id, poolKey, bounds);

      const [token0Price, token1Price] = await Promise.all([
        fetchCryptoPrice(extractedValues.token0),
        fetchCryptoPrice(extractedValues.token1)
      ]);

      const fee1 = formatTokenAmount(positionInfo.fees0, extractedValues.token0) * token0Price;
      const fee2 = formatTokenAmount(positionInfo.fees1, extractedValues.token1) * token1Price;
      const amount0 = formatTokenAmount(positionInfo.amount0, extractedValues.token0) * token0Price;
      const amount1 = formatTokenAmount(positionInfo.amount1, extractedValues.token1) * token1Price;

      const liquidity = amount0 + amount1;
      const roi = ((fee1 + fee2) / liquidity) * 100;
      const apy = ((1 + (roi / 365)) * 365) - 1;

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
        currentPrice: Number(token0Price)
      };
    }));

    return positions;
  } catch (error) {
    console.error('Error fetching positions:', error instanceof AxiosError ? error.message : error);
    return [];
  }
}
