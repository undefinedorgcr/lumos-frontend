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
  Pmin: number,
  Pmax: number,
  Pcurrent: number,
  depositUSD: number
) {
  const sqrtPmin = Math.sqrt(Pmin);
  const sqrtPmax = Math.sqrt(Pmax);
  const sqrtPcurrent = Math.sqrt(Pcurrent);
  const numerator = sqrtPcurrent - sqrtPmin;
  const denominator = 1 / sqrtPcurrent - 1 / sqrtPmax;
  const R = numerator / denominator;
  const deltaX = depositUSD / (Pcurrent + R);
  const deltaY = R * deltaX;

  return [deltaX * Pcurrent, deltaY];
}
