import axios from "axios";

export const fetchCryptoPrice = async (token: string) => {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${token}&tsyms=USD`;
    try {
      const response = await axios.get(url);
      return response.data.RAW?.[token]?.USD.PRICE;
    } catch (error) {
      console.error('Error fetching data:',error);
    }
};