export interface User {
	email: string;
	uId: string;
	fav_pools?: string[];
	user_type?: string;
	remaining_requests?: number;
}
