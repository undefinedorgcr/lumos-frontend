import { Pool } from './Pool';
import { Token } from './Tokens';

export interface EkuboPoolsDisplay {
	token0: Token;
	token1: Token;
	pool: Pool;
	totalFees: number;
	totalTvl: number;
}
