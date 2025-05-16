export interface NFTDB {
  boxId?: string;
  name: string;
  uri: string;
  mintAddress: string;
  description?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
}

export interface NFT {
  name: string;
  uri: string;
  mintAddress: string;
  description?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
}
