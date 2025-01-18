import axios from "axios";

export const fetchCryptoPrice = async (token: string): Promise<number> => {
    const url = `/api/${token.toLowerCase()}`;  // Usa la ruta del proxy
    try {
        const response = await axios.get(url, {
            headers: {
                'x-api-key': "lfztRPhSwx9aC1HfQxzAW5ze0KEAhG1s5FBwRQ2i",
                'Accept': 'application/json',
            }
        });
        return Number(BigInt(response.data.price)) / 10 ** response.data.decimals;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};