/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

const API_URL = `${process.env.LUMOS_BACKEND_URL}/users`;

export async function POST(req: Request) {
    try {
        const { email, uId, fav_pools, user_type, remaining_requests } = await req.json();
        const response = await axios.post(API_URL, { email, uId, fav_pools, user_type, remaining_requests }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.LUMOS_API_SECRET_TOKEN,
            }
        });
        return NextResponse.json({ data: response.data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const uId = searchParams.get("uId");
        console.log(process.env.LUMOS_API_SECRET_TOKEN);
        const response = await axios.get(`${API_URL}?uId=${uId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.LUMOS_API_SECRET_TOKEN,
            }
        });

        if (response.data.users?.length > 0) {
            return NextResponse.json({ data: response.data.users[0] }, { status: 200 });
        } else {
            return NextResponse.json({ data: 'User not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
