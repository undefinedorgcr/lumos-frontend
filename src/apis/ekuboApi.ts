import { Token } from '@/types/Tokens';
import axios from 'axios';
import { fetchCryptoPrice } from './chainLink';
import { Pool } from '@/types/Pool';
import { PoolState } from '@/types/PoolState';
import { num } from 'starknet';
import { normalizeHex } from '@/utils';

export const TOP_TOKENS_SYMBOL = ["STRK", "USDC", "ETH", "EKUBO", "DAI", "WBTC",
    "USDT", "wstETH", "LORDS", "ZEND", "rETH", "UNI", "NSTR", "CRM", "CASH", "xSTRK", "sSTRK", "kSTRK"];

export async function fetchTokens() {
    const response = await axios.get('https://mainnet-api.ekubo.org/tokens');
    return response.data;
}

export async function fetchLatestPairVolume(t1: Token, t2: Token) {
    const response =
        await axios.get(`https://mainnet-api.ekubo.org/pair/${(t1.l2_token_address)}/${(t2.l2_token_address)}/volume`);
    const t1price = await fetchCryptoPrice(t1.symbol);
    const t2price = await fetchCryptoPrice(t2.symbol);
    let volume1 = 0;
    let volume2 = 0
    if (t1.symbol == "USDC" || t1.symbol == "USDT") {
        volume1 = (response.data.volumeByToken_24h[0].volume / 10 ** 6) * t1price;
    }
    else {
        volume1 = (response.data.volumeByToken_24h[0].volume / 10 ** 18) * t1price;
    }
    if (t2.symbol == "USDC" || t2.symbol == "USDT") {
        volume2 = (response.data.volumeByToken_24h[1].volume / 10 ** 6) * t2price;
    }
    else {
        volume2 = (response.data.volumeByToken_24h[1].volume / 10 ** 18) * t2price;
    }
    return volume1 + volume2;
}

export async function fetchPool(t1: Token, t2: Token, fee: number) {
    const feeU128 = (fee * 2 ** 128) / 10 ** 37;
    const feeStr = feeU128.toString().replace(".", "");
    const response = await axios.get(`https://mainnet-api.ekubo.org/pair/${(t1.l2_token_address)}/${(t2.l2_token_address)}/pools`);
    const topPools = response.data.topPools;
    let currentPool: Pool | undefined = undefined;
    [...topPools].forEach(async (pool: Pool) => {
        if (pool.fee.toString().slice(0, 16) == feeStr.slice(0, 16)) {
            currentPool = pool;
        }
    });
    if (currentPool == undefined) {
        return null;
    }
    return currentPool;
}

export async function fetchPoolKeyHash(t1: Token, t2: Token, fee: number): Promise<PoolState | undefined> {
    const response = (await axios.get(`https://mainnet-api.ekubo.org/pools`)).data;
    const feeU128 = (fee * 2 ** 128) / 10 ** 37;
    const feeStr = feeU128.toString().replace(".", "");
    let currentPool: PoolState | undefined = undefined;
    [...response].forEach(async (poolInfo: PoolState) => {
        if (poolInfo.token0 == normalizeHex(t1.l2_token_address).trim() &&
            poolInfo.token1 == normalizeHex(t2.l2_token_address).trim() &&
            num.hexToDecimalString(poolInfo.fee).slice(0, 2) == feeStr.slice(0, 2)
        ) {
            currentPool = poolInfo;
        }
    });
    return currentPool;
}

export async function fetchTvl(t1: Token, t2: Token) {
    const response =
        (await axios.get(`https://mainnet-api.ekubo.org/pair/${t1.l2_token_address}/${t2.l2_token_address}/tvl`)).data.tvlByToken;

    let val1 = 0;
    let val2 = 0;
    const t1price = await fetchCryptoPrice(t1.symbol);
    const t2price = await fetchCryptoPrice(t2.symbol);
    if (t1.symbol == "USDC" || t1.symbol == "USDT") {
        val1 = (response[0].balance / 10 ** 6) * t1price;
    }
    else {
        val1 = (response[0].balance / 10 ** 18) * t1price;
    }
    if (t2.symbol == "USDC" || t2.symbol == "USDT") {
        val2 = (response[1].balance / 10 ** 6) * t2price;
    }
    else {
        val2 = (response[1].balance / 10 ** 18) * t2price;
    }

    return val1 + val2;
}