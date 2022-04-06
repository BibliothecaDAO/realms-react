import { Wallet } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { RequestMethod } from 'node-mocks-http';
import { createMocks } from 'node-mocks-http';
import { messageKey } from '@/util/messageKey';

import mintHandler from './minigame_alpha_mint';

describe('/api/minigame_alpha_mint', () => {
  function mockRequestResponse(method: RequestMethod = 'GET') {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({ method });
    return { req, res };
  }

  test('mint light', async () => {
    const privKey = '0x1234567890';
    const starknetAddress = '0x2345438904320432';

    const wallet = new Wallet(privKey);
    const sig = await wallet.signMessage(messageKey(starknetAddress));

    const { req, res } = mockRequestResponse();
    req.body = {
      starknetAddress,
      sig,
      chosenSide: 'light',
      gameIdx: '3',
    };
    await mintHandler(req, res);

    expect(res.statusCode).toBe(200);
  });
});
