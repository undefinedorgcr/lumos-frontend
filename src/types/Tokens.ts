export interface Token {
	name: string;
	symbol: string;
	decimals: number;
	l2_token_address: string;
	sort_order: number;
	total_supply: number | null;
	hidden: boolean;
	logo_url: string;
}
