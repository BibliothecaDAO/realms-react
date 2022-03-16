import type { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import LordsERC2OContract from '@/abi/balance.json';
import JourneyABI from '@/abi/journey.json';
import { LORDS_TOKEN_ADDRESS, LORDS_JOURNEY_ADDRESS } from '@/constants/index';

export const fetchLordsBalance = async (address: string) => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL_1,
    1
  );
  const journeyContract = new ethers.Contract(
    LORDS_JOURNEY_ADDRESS,
    JourneyABI.abi,
    provider
  );

  const lordsContract = new ethers.Contract(
    LORDS_TOKEN_ADDRESS,
    LordsERC2OContract,
    provider
  );

  try {
    const results = await Promise.all<BigNumber>([
      journeyContract.lordsAvailable(address),
      lordsContract.balanceOf(address),
    ]);
    // Return formatted balance
    return results[0].add(results[1]);
  } catch (e: any) {
    throw `Could not fetch L1 LORDS balance: ${e.message}`;
  }
};
