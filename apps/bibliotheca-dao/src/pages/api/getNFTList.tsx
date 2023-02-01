import type { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

const API_URL =
  process.env.GRAPH_API ||
  'https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms';
const walletaddress = process.env.WALLETADDRESS || ''; // need to put as env

export default async function handler(req: NextRequest) {
  const query = `
		query Realms($address: String) {
      realms(where: { currentOwner: $address}) {
				tokenId
        name
        resourceIds
        rarityScore
        rarityRank
			}
		}
  `;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ query, variables: { address: walletaddress } }),
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        // Allow list of backend headers.
        'content-type': response.headers.get('content-type') || '',
        'cache-control': 'public, s-maxage=600, stale-while-revalidate=59',
      },
    });
  } catch (e) {
    console.log(e);
  }
}
