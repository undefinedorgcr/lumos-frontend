export interface Pool {
	fee: number;
	tick_spacing: number;
	extension: number;
	volume0_24h: number;
	volume1_24h: number;
	fees0_24h: number;
	fees1_24h: number;
	tvl0_total: number;
	tvl1_total: number;
	tvl0_delta_24h: number;
	tvl1_delta_24h: number;
}
