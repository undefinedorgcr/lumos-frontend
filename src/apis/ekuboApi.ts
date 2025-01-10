import axios from 'axios';

export const TOP_TOKENS_SYMBOL = ["STRK", "USDC", "ETH", "EKUBO", "DAI", "WBTC",
    "USDT", "wstETH", "LORDS", "ZEND", "rETH", "UNI", "NSTR", "CRM", "CASH", "xSTRK", "sSTRK", "kSTRK"];

export async function fetchTokens() {
    const response = await axios.get('https://mainnet-api.ekubo.org/tokens');
    return response.data;
}

export async function fetchPositions() {
    console.log("hola");
}