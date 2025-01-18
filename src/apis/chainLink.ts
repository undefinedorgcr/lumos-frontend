import axios from "axios";

export const fetchCryptoPrice = async (token: string) => {
    const url = `https://api.cryptorank.io/v2/currencies?include=sparkline7d&symbol=${token}&sortBy=rank&sortDirection=ASC&limit=100&skip=0`;
    try {
      const response = await axios.get(url, {
        headers: {
          'x-api-key': "043f8bd5727489fb2b351783ce18b2f3658cefa19d87e92c4524af645feb"
        }
      });
      return response.data.data[0].price;
    } catch (error) {
      console.error('Error fetching data:',error);
    }
};