import { utils } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AccountInterface } from 'starknet';
import { ec, Account } from 'starknet';
import { ElementToken, MINIMUM_LORDS_REQUIRED } from '@/constants/index';
import { fetchLordsBalance, fetchNumberRealmsStaked } from '@/util/fetchL1';
import { messageKey } from '@/util/messageKey';
import {
  getModuleAddress,
  getNextMintAmount,
  getTotalElementsMinted,
  provider,
  TOKEN_INDEX_OFFSET_BASE,
} from '@/util/minigameApi';

export type MintingError = {
  success: false;
  error: string;
};

const handleMint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sig, starknetAddress, chosenSide, gameIdx } = req.body;

  const ethAddress = utils.verifyMessage(messageKey(starknetAddress), sig);

  const lordsBalance = await fetchLordsBalance(ethAddress);

  const numRealmsStaked = await fetchNumberRealmsStaked(ethAddress);

  const suppressMintRequirement =
    process.env.NEXT_PUBLIC_SUPPRESS_TOKEN_REQUIREMENT == '1';

  if (
    lordsBalance.lt(MINIMUM_LORDS_REQUIRED) &&
    numRealmsStaked == 0 &&
    !suppressMintRequirement
  ) {
    res.send(
      JSON.stringify({
        success: false,
        error: 'Insufficient $LORDS balance or staked Realm count',
      })
    );
    return;
  }

  const minterPrivKey = process.env.ELEMENTS_MINTER_PRIVATE_KEY as string;

  let signerAccount: AccountInterface;
  try {
    const privKey = ec.getKeyPair(minterPrivKey);
    const account =
      (process.env.ELEMENTS_MINTER_ACCOUNT_ADDRESS as string) ||
      '0x75e3a462923e8863e5b57d42754156753c9ebc8f0ac4423b120abf96868dfe8';
    signerAccount = new Account(provider, account, privKey);
  } catch (e) {
    console.error('SIGNING ERROR:', e);
    throw e;
  }

  const gameIndexInt = parseInt(gameIdx);
  const nextGameIdx = gameIndexInt + 1;

  // The amount includes 2-decimal precision
  // so multiply by 100
  let amountToMint: number;
  try {
    const totals = await getTotalElementsMinted(nextGameIdx);
    // Dynamic element balancing
    amountToMint = getNextMintAmount(totals, chosenSide);
  } catch (e) {
    console.error('CONTRACT CALL ERROR:', e);
    throw e;
  }

  // Elements cannot be re-used between games
  // so the 1155 token indexes start at a deterministic index
  // and IDs are offset from there
  // Ex. light = startIndex + 1, dark = startIndex + 2
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const INDEX_BASE_FACTOR = TOKEN_INDEX_OFFSET_BASE;
  const tokenStartIndex = nextGameIdx * INDEX_BASE_FACTOR;

  const elementBalancerModule = await getModuleAddress('4');

  const entrypoint = 'mint_elements';
  const mintArgs = [
    nextGameIdx,
    ethAddress,
    starknetAddress,
    chosenSide == 'light'
      ? tokenStartIndex + ElementToken.Light
      : tokenStartIndex + ElementToken.Dark,
    amountToMint,
  ];

  try {
    const result = await signerAccount.execute(
      {
        contractAddress: elementBalancerModule,
        entrypoint,
        calldata: mintArgs,
      },
      undefined,
      {
        maxFee: 0,
      }
    );
    res.send(JSON.stringify(result));
    return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('MINTING ERROR:', e);
    res.send(
      JSON.stringify({
        success: false,
        error: e.message,
      })
    );
    return;
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await handleMint(req, res);
  } catch (e: any) {
    res.send(
      JSON.stringify({
        success: false,
        error: e.message,
      })
    );
  }
};
