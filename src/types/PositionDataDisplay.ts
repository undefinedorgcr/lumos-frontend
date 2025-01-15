interface Pool {
    t1: string;
    t2: string;
  }
  
  interface PriceRange {
    min: number;
    max: number;
  }
  
  export interface PositionDataDisplay {
    positionId: string;
    pool: Pool;
    roi: number;
    feeAPY: number;
    liquidity: number;
    priceRange: PriceRange;
    currentPrice: number;
  }
  