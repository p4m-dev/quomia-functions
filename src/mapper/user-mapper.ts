import { Balance } from "../models/user";

const mapUserBalance = (
  walletBalance: string,
  priceBalance: string,
  nftsAmount: string,
  estimatedValue: string
): Balance => {
  return {
    walletBalance,
    priceBalance,
    nftsAmount,
    estimatedValue,
  };
};

export { mapUserBalance };
