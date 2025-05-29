export interface Balance {
  walletBalance: string;
  priceBalance: string;
  nftsAmount: string;
  estimatedValue: string;
  percentage: Item;
  lossProfit: Item;
}

export interface Item {
  symbol: string;
  value: string;
}
