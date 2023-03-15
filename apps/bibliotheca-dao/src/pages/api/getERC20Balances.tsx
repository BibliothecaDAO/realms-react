import type { NextRequest, NextResponse } from 'next/server';

const walletaddress = process.env.WALLETADDRESS || ''; // need to put as env
const apikey = process.env.NEXT_PUBLIC_APIKEY;

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const tokenString = token ? 'token=' + token + '&' : null;

  let url = `https://api.ethplorer.io/getAddressInfo/${walletaddress}?`;
  if (tokenString) {
    url = url + tokenString;
  }
  url = url + `apiKey=${apikey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    return new Response(response.body, {
      status: response.status,
    });
  } catch (e) {
    return new Response('error', {
      status: 400,
    });
  }
}
