import { Balance, Item } from "../models/user";

const mapUserBalance = (
  walletBalance: number,
  priceBalance: number,
  tokenAmount: number,
  totalEstimatedPrice: number,
  percentage: number,
  lossProfit: number
): Balance => {
  return {
    walletBalance: mapSOLValue(walletBalance),
    priceBalance: mapCurrency(priceBalance),
    nftsAmount: `${tokenAmount} NFTs`,
    estimatedValue: mapSOLValue(totalEstimatedPrice),
    percentage: mapPercentage(percentage),
    lossProfit: mapLossProfit(lossProfit),
  };
};

const mapSOLValue = (value: number) => {
  return value
    .toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })
    .concat(" SOL");
};

const mapPercentage = (value: number): Item => {
  return {
    symbol: value >= 0 ? "▲" : "▼",
    value: Math.abs(value).toLocaleString("it-IT", {
      style: "percent",
      minimumFractionDigits: 2,
    }),
  };
};

const mapLossProfit = (value: number): Item => {
  return {
    symbol: value >= 0 ? "+" : "-",
    value: mapCurrency(value),
  };
};

const mapCurrency = (value: number) => {
  return Math.abs(value).toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
  });
};

export { mapUserBalance, mapSOLValue };
