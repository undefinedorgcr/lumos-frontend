export interface VesuEarnPosition {
	poolId: string;
	pool: string;
	type: string;
	collateral: string;
	total_supplied: number;
	risk: string;
	poolApy: number;
	rewardsApy: number;
}

export interface VesuBorrowPosition {
	pool: string;
	type: string;
	collateral: string;
	debt: string;
	total_supplied: number;
}
