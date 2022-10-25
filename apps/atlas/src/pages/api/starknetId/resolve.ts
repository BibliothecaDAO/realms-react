import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { toFelt } from 'starknet/dist/utils/number';

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const address = searchParams.get('address');

  try {
    if (address) {
      const response = await fetch(
        `https://goerli.indexer.starknet.id/addr_to_domain?addr=${toFelt(
          address
        )}`,
        {
          method: 'GET',
        }
      );

      return new NextResponse(response.body, {
        status: response.status,
      });
    } else {
      return NextResponse.json({ error: 'address not defined' });
    }
  } catch (e) {
    return new NextResponse('error', {
      status: 400,
    });
  }
}

export const config = {
  runtime: 'experimental-edge',
};
