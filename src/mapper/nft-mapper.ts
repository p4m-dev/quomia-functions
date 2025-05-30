import { NFT, NFTDB } from "../models/nft";
import { Box } from "../models/types";
import { JsonMetadata } from "@metaplex-foundation/js";
import { mapCurrency } from "./user-mapper";

const mapJsonMetadata = (
  box: Box,
  quantity: number,
  currentPrice: number,
  purchaseValue: number
): JsonMetadata => {
  const metadata: JsonMetadata = {
    name: box.info.title,
    attributes: [
      {
        trait_type: "Category",
        value: box.info.category,
      },
      {
        trait_type: "Type",
        value: box.info.type,
      },
      {
        trait_type: "Start Date",
        value: box.dates.startDate.toISOString(),
      },
      {
        trait_type: "End Date",
        value: box.dates.endDate.toISOString(),
      },
      {
        trait_type: "Quantity",
        value: quantity.toString(),
      },
      {
        trait_type: "Current Price",
        value: currentPrice.toString(),
      },
      {
        trait_type: "Purchase Value",
        value: purchaseValue.toString(),
      },
    ],
  };
  return metadata;
};

const mapNFT = (
  metadata: JsonMetadata,
  box: Box,
  uri: string,
  mintAddress: string,
  boxId: string,
  quantity: number,
  currentPrice: number,
  purchaseValue: number
): NFTDB => {
  return {
    boxId: boxId,
    name: metadata.name ?? "",
    uri: uri,
    description: metadata.description,
    image: metadata.image,
    mintAddress: mintAddress,
    startDate: box.dates.startDate,
    endDate: box.dates.endDate,
    quantity: quantity,
    currentPrice: currentPrice,
    purchaseValue: purchaseValue,
  };
};

const mapNFTFromDB = (nft: NFTDB): NFT => {
  return { ...nft, quantity: mapCurrency(nft.quantity) };
};

export { mapJsonMetadata, mapNFT, mapNFTFromDB };
