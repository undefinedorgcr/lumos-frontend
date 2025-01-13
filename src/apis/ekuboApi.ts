import { Token } from '@/types/Tokens';
import axios from 'axios';
import { fetchCryptoPrice } from './chainLink';
import { Pool } from '@/types/Pool';
import { PoolState } from '@/types/PoolState';
import { num } from 'starknet';
import { normalizeHex } from '@/utils';
import { Position} from '@/types/Position';

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


export const fetchPosition = async(address: string) => {
	try {
		const positions: Position[] = [];
		const getPositionsUrl = `https://sepolia-api.ekubo.org/positions/${address}`;
		const userPositions = await axios.get(getPositionsUrl);
		for (const position of userPositions.data.data) {
			const positionMetadata = await fetchMetadataByPositionId(position.id);
			const positionHistory = await fetchHistoryByPositionId(position.id);
			const positionExtractValues = extractValues(positionMetadata.name);
			let positionHistoryLiquidity = 0;
			for (const positionHistoryRecord of positionHistory.events) {
				if (positionHistoryRecord.type === 'update') {
					const token1Formatted = formatToken(positionHistoryRecord.delta0, positionExtractValues.token1);
					const token2Formatted = formatToken(positionHistoryRecord.delta1, positionExtractValues.token2);
					const token1PriceInUSD = await fetchCryptoPrice(positionExtractValues.token1);
					const token2PriceInUSD = await fetchCryptoPrice(positionExtractValues.token2);
					const token1InUSD = calculateUSDByToken(token1Formatted, token1PriceInUSD.RAW?.[positionExtractValues.token1]?.USD.PRICE);
					const token2InUSD = calculateUSDByToken(token2Formatted, token2PriceInUSD.RAW?.[positionExtractValues.token2]?.USD.PRICE);
					const positionHistoryRecordLiquidity = (token1InUSD + token2InUSD);
					positionHistoryLiquidity = positionHistoryLiquidity + positionHistoryRecordLiquidity;
				}
			}
			const mainTokenPriceInUSD = await fetchCryptoPrice(positionExtractValues.token1);
			const newPosition = {
				positionId: position.id,
				pool: {
					t1: positionExtractValues.token1,
					t2: positionExtractValues.token2,
				},
				roi: 0.9, // TODO
				feeAPY: 11.8, // TODO
				liquidity: positionHistoryLiquidity,
				priceRange: {
					min: positionExtractValues.price1,
					max: positionExtractValues.price2,
				},
				currentPrice: mainTokenPriceInUSD.DISPLAY?.[positionExtractValues.token1]?.USD.PRICE
			};
			positions.push(newPosition);
		}
		return positions;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Axios Error:', error.message);
		} else {
			console.error('Unexpected Error:', error);
		}
	}
};
const formatToken = (token: number, tokenSymbol: string) => {
	if (tokenSymbol === "USDC") {
		return (token / 10 ** 6);
	} else {
		return (token / 10 ** 18);
	}
}
const extractValues = (input: string) => {
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
const fetchMetadataByPositionId = async(positionId: string) => {
	const positionMetadataUrl = `https://sepolia-api.ekubo.org/${positionId}`;
	try {
		const response = await axios.get(positionMetadataUrl);
		return response.data;
	} catch (error) {
		console.error('Error fetchMetadataByPosition data:', error);
	}
};

const fetchHistoryByPositionId = async(positionId: number) => {
	const url = `https://sepolia-api.ekubo.org/${positionId}/history`;
	try {
		const response = await axios.get(url, {
			headers: {
				'Accept': 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetchHistoryByPositionId the API:', error);
		throw error;
	}
};
const calculateUSDByToken = (tokenPrice: number, tokenPriceUSD: number) => {
	return (tokenPrice * tokenPriceUSD);
};