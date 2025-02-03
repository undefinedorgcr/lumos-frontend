import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const q96 = 2 ** 96;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeHex = (hex: string) => hex.replace(/^0x0+/, "0x");

export function tickToPrice(tick: number) {
  const price = Math.pow(1.000001, tick);
  return price;
}

export function calculateDepositAmounts(
  depositUSD: number,
  currentPriceToken0USD: number,
  currentPriceToken1USD: number,
  minPriceToken1PerToken0: number,
  maxPriceToken1PerToken0: number
) {
  const P = currentPriceToken0USD / currentPriceToken1USD;
  const sqrtP = Math.sqrt(P);
  const sqrtPa = Math.sqrt(minPriceToken1PerToken0);
  const sqrtPb = Math.sqrt(maxPriceToken1PerToken0);
  
  const term0 = (1 / sqrtP - 1 / sqrtPb) * currentPriceToken0USD;
  const term1 = (sqrtP - sqrtPa) * currentPriceToken1USD;
  const deltaL = depositUSD / (term0 + term1);
  
  const amount0 = deltaL * (1 / sqrtP - 1 / sqrtPb);
  const amount1 = deltaL * (sqrtP - sqrtPa);
  
  return [ amount0 * currentPriceToken0USD, amount1 * currentPriceToken1USD ];
}
