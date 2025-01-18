import { Token } from "@/types/Tokens";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const q96 = 2 ** 96;

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

export function priceToTick(p: number): number {
  return Math.floor(Math.log(p) / Math.log(1.0001));
}

export function price_to_sqrtp(price: number) {
  return (Math.sqrt(price) * q96)
}

export function liquidity0(amount: number, pa: number, pb: number): number {
  if (pa > pb) {
    [pa, pb] = [pb, pa];
  }
  return (amount * (pa * pb) / q96) / (pb - pa);
}

export function liquidity1(amount: number, pa: number, pb: number): number {
  if (pa > pb) {
    [pa, pb] = [pb, pa];
  }
  return (amount * q96) / (pb - pa);
}

export function getVirtualLiquidity(l1: number, l2: number) {
  return Math.floor(Math.min(l1, l2));
}