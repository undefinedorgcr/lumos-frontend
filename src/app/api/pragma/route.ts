/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
	try {
		const { endpoint } = await req.json();
		const url = `https://api.dev.pragma.build/node/v1/data/${endpoint.toLowerCase()}/usd`;
		const response = await axios.get(url, {
			headers: {
				'x-api-key': process.env.PRAGMA_API_KEY,
				Accept: 'application/json',
			},
		});
		return NextResponse.json(
			{
				data:
					Number(BigInt(response.data.price)) /
					10 ** response.data.decimals,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error('Error in pragma API:', error.message);
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
