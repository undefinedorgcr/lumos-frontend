/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

const API_URL = `${process.env.LUMOS_BACKEND_URL}/waitlist`;

export async function POST(req: Request) {
	try {
		const { email } = await req.json();
		const response = await axios.post(
			API_URL,
			{ email },
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization:
						'Bearer ' + process.env.LUMOS_API_SECRET_TOKEN,
				},
			}
		);
		return NextResponse.json({ data: response.data }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
