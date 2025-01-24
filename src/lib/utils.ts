import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const q96 = 2 ** 96;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function calculateDepositAmounts(
  liquidity: number,
  priceMin: number,
  priceMax: number,
  currentPrice: number
): { token0: number; token1: number } {
  const sqrtPMin = Math.sqrt(priceMin);
  const sqrtPMax = Math.sqrt(priceMax);
  const sqrtP = Math.sqrt(currentPrice);

  let token0 = 0;
  let token1 = 0;

  if (currentPrice <= priceMin) {
    token0 = liquidity * (1 / sqrtPMin - 1 / sqrtPMax);
  } else if (currentPrice >= priceMax) {
    token1 = liquidity * (sqrtPMax - sqrtPMin);
  } else {
    token0 = liquidity * (sqrtPMax - sqrtP) / (sqrtP * sqrtPMax);
    token1 = liquidity * (sqrtP - sqrtPMin);
  }

  return { token0, token1 };
}

export const normalizeHex = (hex: string) => hex.replace(/^0x0+/, "0x");

export function tickToPrice(tick: number) {
  const price = Math.pow(1.000001, tick);
  return price;
}
