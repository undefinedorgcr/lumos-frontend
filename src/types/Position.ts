export interface EkuboPosition {
  positionId: number;
  pool: {
    t0: string,
    t1: string
  };
  roi: number;
  feeAPY: number;
  liquidity: number;
  priceRange: {
    min: number;
    max: number;
  };
  currentPrice: number;
}

export interface VesuPosition {
  pool: string,
  type: string,
  collateral: string,
  total_supplied: number,
}