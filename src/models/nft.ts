export interface NFT {
  boxId: string;
  name: string;
  uri: string;
  mintAddress: string;
  description?: string;
  image?: string;
  startDate: Date;
  endDate: Date;
}
