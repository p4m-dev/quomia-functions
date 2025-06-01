import axios from "axios";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, number>({
  max: 1,
  ttl: 60_000,
});

const getSolanaPrice = async (): Promise<number> => {
  const cached = cache.get("solPrice");
  if (cached !== undefined) return cached;

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
    console.log("SOL Price (EUR): ", price);
    cache.set("solPrice", price);

    return price;
  } catch (error) {
    console.error("Error while retrieving SOL Price: ", error);
    throw error;
  }
};

export { getSolanaPrice };
