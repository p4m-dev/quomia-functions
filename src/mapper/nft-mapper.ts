import { NFT, NFTDB } from "../models/nft";
import { Box } from "../models/types";
import { JsonMetadata } from "@metaplex-foundation/js";

const mapJsonMetadata = (box: Box): JsonMetadata => {
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
    ],
  };
  return metadata;
};

const mapNFT = (
  metadata: JsonMetadata,
  box: Box,
  uri: string,
  mintAddress: string,
  boxId: string
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
  };
};

export { mapJsonMetadata, mapNFT };
