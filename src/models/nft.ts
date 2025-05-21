export interface NFTDB {
  boxId?: string;
  name: string;
  uri: string;
  mintAddress: string;
  description?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  initialPrice: number;
}

export interface NFT {
  name: string;
  uri: string;
  mintAddress: string;
  description?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  initialPrice: number;
}
