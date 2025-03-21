interface TokenPriceCacheEntry {
	price: number;
	timestamp: number; // Momento en que se guardó el precio (en milisegundos)
}

export class TokenPriceCache {
	private cache: Record<string, TokenPriceCacheEntry> = {};
	private ttl: number;

	constructor(ttl: number) {
		this.ttl = ttl;
	}
	get(token: string): number | null {
		const entry = this.cache[token];
		if (!entry) {
			return null;
		}
		if (Date.now() - entry.timestamp > this.ttl) {
			delete this.cache[token];
			return null;
		}
		return entry.price;
	}

	set(token: string, price: number): void {
		this.cache[token] = {
			price,
			timestamp: Date.now(),
		};
	}
}
