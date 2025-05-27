import axios from "axios";

const getSolanaPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "solana",
          vs_currencies: "eur",
        },
      }
    );

    const price: number = response.data.solana.eur;
    console.log("SOL Price (EUR):", price);
    return price;
  } catch (error) {
    console.error("Error while retrieving SOL Price: ", error);
    throw error;
  }
};

export { getSolanaPrice };
