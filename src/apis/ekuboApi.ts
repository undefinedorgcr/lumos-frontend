/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contract, num, number } from 'starknet';
import axios, { AxiosError } from 'axios';

import { Token } from '@/types/Tokens';
import { Pool } from '@/types/Pool';
import { PoolState } from '@/types/PoolState';
import { Position } from '@/types/Position';
import { normalizeHex, price_to_sqrtp, priceToTick, tickToPrice } from '@/lib/utils';
import { EKUBO_POSITIONS_MAINNET_ADDRESS, provider } from '@/constants';
import { EKUBO_POSITIONS } from '@/abis/EkuboPositions';
import { fetchCryptoPrice } from './pragma';

const BASE_URL = "https://mainnet-api.ekubo.org";
const QUOTER_URL = "https://quoter-mainnet-api.ekubo.org";

export const TOP_TOKENS_SYMBOL = [
  "STRK", "USDC", "ETH", "EKUBO", "DAI", "WBTC",
  "USDT", "wstETH", "LORDS", "ZEND", "rETH", "UNI",
  "NSTR", "CRM", "CASH", "xSTRK", "sSTRK", "kSTRK"
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
  token1: string;
  token2: string;
  price1: number;
  price2: number;
  percentage1: number;
  percentage2: number;
}

const extractPositionMetadata = (input: string): TokenMetadata => {
  const [pair, prices, percentages] = input.split(' : ');
  const [token2, token1] = pair.split(' / ');
  const [price1, price2] = prices.split(' <> ');
  const [percentage1, percentage2] = percentages.split(' / ');

  return {
    token1,
    token2,
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

export async function fetchLatestPairVolume(t1: Token, t2: Token): Promise<number> {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/pair/${t1.l2_token_address}/${t2.l2_token_address}/volume`
    );

    const [t1price, t2price] = await Promise.all([
      fetchCryptoPrice(t1.symbol),
      fetchCryptoPrice(t2.symbol)
    ]);

    const volume1 = formatTokenAmount(data.volumeByToken_24h[0].volume, t1.symbol) * t1price;
    const volume2 = formatTokenAmount(data.volumeByToken_24h[1].volume, t2.symbol) * t2price;

    return volume1 + volume2;
  } catch (error) {
    console.error('Error fetching pair volume:', error);
    throw error;
  }
}

export async function fetchPool(t1: Token, t2: Token, fee: number): Promise<Pool | null> {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/pair/${t1.l2_token_address}/${t2.l2_token_address}/pools`
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

export async function fetchPoolKeyHash(t1: Token, t2: Token, fee: number): Promise<PoolState | undefined> {
  try {
    const { data } = await axios.get(`${BASE_URL}/pools`);
    const feeStr = calculateFeeU128(fee);
    const t1Address = normalizeHex(t1.l2_token_address).trim();
    const t2Address = normalizeHex(t2.l2_token_address).trim();

    return data.find((poolInfo: PoolState) =>
      poolInfo.token0 === t1Address &&
      poolInfo.token1 === t2Address &&
      num.hexToDecimalString(poolInfo.fee).slice(0, 2) === feeStr.slice(0, 2)
    );
  } catch (error) {
    console.error('Error fetching pool key hash:', error);
    throw error;
  }
}

export async function fetchTvl(t1: Token, t2: Token): Promise<number> {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/pair/${t1.l2_token_address}/${t2.l2_token_address}/tvl`
    );

    const [t1price, t2price] = await Promise.all([
      fetchCryptoPrice(t1.symbol),
      fetchCryptoPrice(t2.symbol)
    ]);

    const val1 = formatTokenAmount(data.tvlByToken[0].balance, t1.symbol) * t1price;
    const val2 = formatTokenAmount(data.tvlByToken[1].balance, t2.symbol) * t2price;

    return val1 + val2;
  } catch (error) {
    console.error('Error fetching TVL:', error);
    throw error;
  }
}

export async function fetchLiquidityInRange(
  t1: Token,
  t2: Token,
  minPrice: number,
  maxPrice: number,
  t1price: number
): Promise<number | null> {
  let minTick = Math.floor(Math.log(minPrice) / Math.log(1.0001));
  let maxTick = Math.floor(Math.log(maxPrice) / Math.log(1.0001));

  let liquidityMap: { [tick: number]: bigint } = {};

  let totalLiquidity = BigInt(0);
  try {
    const { data } = await axios.get(
      `${BASE_URL}/tokens/${t1.l2_token_address}/${t2.l2_token_address}/liquidity`
    );

    const liquidityData = data.data;

    liquidityData.sort((a: { tick: number; }, b: { tick: number; }) => a.tick - b.tick);

    liquidityData.forEach(({ tick, net_liquidity_delta_diff }: { tick: number, net_liquidity_delta_diff: number }) => {
      totalLiquidity += BigInt(net_liquidity_delta_diff);
      liquidityMap[tick] = totalLiquidity;
    });

    let closestTick = Object.keys(liquidityMap).reduce((closest, tick) => {
      const tickNum = Number(tick);
      const diffWithMin = Math.abs(tickNum - minTick);
      const diffWithMax = Math.abs(tickNum - maxTick);
      
      const closestDiff = Math.min(diffWithMin, diffWithMax);
      const currentDiff = Math.abs(Number(closest) - minTick) + Math.abs(Number(closest) - maxTick);

      return closestDiff < currentDiff ? tick : closest;
    }, Object.keys(liquidityMap)[0]);

    const closestLiquidity = liquidityMap[Number(closestTick)];

    return Number(closestLiquidity);

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

      const [token1Price, token2Price] = await Promise.all([
        fetchCryptoPrice(extractedValues.token1),
        fetchCryptoPrice(extractedValues.token2)
      ]);

      const fee1 = formatTokenAmount(positionInfo.fees0, extractedValues.token1) * token1Price;
      const fee2 = formatTokenAmount(positionInfo.fees1, extractedValues.token2) * token2Price;
      const amount1 = formatTokenAmount(positionInfo.amount0, extractedValues.token1) * token1Price;
      const amount2 = formatTokenAmount(positionInfo.amount1, extractedValues.token2) * token2Price;

      const liquidity = amount1 + amount2;
      const roi = ((fee1 + fee2) / liquidity) * 100;
      const apy = ((1 + (roi / 365)) * 365) - 1;

      return {
        positionId: position.id,
        pool: {
          t1: extractedValues.token1,
          t2: extractedValues.token2,
        },
        roi,
        feeAPY: apy,
        liquidity,
        priceRange: {
          min: extractedValues.price1,
          max: extractedValues.price2,
        },
        currentPrice: Number(token1Price)
      };
    }));

    return positions;
  } catch (error) {
    console.error('Error fetching positions:', error instanceof AxiosError ? error.message : error);
    return [];
  }
}
