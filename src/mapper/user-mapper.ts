import { Balance } from "../models/user";

const mapUserBalance = (
  walletBalance: string,
  priceBalance: string,
  nftsAmount: string,
  estimatedValue: string,
  percentage: string,
  lossProfit: string
): Balance => {
  return {
    walletBalance,
    priceBalance,
    nftsAmount,
    estimatedValue,
    percentage,
    lossProfit,
  };
};

export { mapUserBalance };
