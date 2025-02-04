import axios from "axios";

export const fetchCryptoPrice = async (token: string): Promise<number> => {
    const url = `/pragma/${token.toLowerCase()}`;
    const response = await axios.get(url, {
        headers: {
            'x-api-key': process.env.NEXT_PUBLIC_PRAGMA_API_KEY,
            'Accept': 'application/json',
        }
    });
    return Number(BigInt(response.data.price)) / 10 ** response.data.decimals;
};