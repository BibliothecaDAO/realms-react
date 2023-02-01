import type { NextRequest, NextResponse } from 'next/server';

const lordsAddress = process.env.WALLETADDRESS || ''; // need to put as env
const apikey = process.env.NEXT_PUBLIC_APIKEY;

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  const tokenString = token || lordsAddress;

  const url = `https://api.ethplorer.io/getTokenInfo/${tokenString}?apiKey=${apikey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    return new Response(response.body, {
      status: response.status,
    });
  } catch (e) {
    console.log(e);
  }
}
