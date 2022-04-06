import type { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import LordsERC2OContract from '@/abi/balance.json';
import JourneyABI from '@/abi/journey.json';
import {
  LORDS_TOKEN_ADDRESS,
  LORDS_JOURNEY_ADDRESS,
  LORDS_JOURNEY_V2_ADDRESS,
} from '@/constants/index';

const mainnetId = 1;

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL_1,
  mainnetId
);

const journeyContract = new ethers.Contract(
  LORDS_JOURNEY_ADDRESS,
  JourneyABI.abi,
  provider
);

// Function used in the Desiege minigame to compare users LORDS balance
export const fetchLordsBalance = async (address: string) => {
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

// Function used in the Desiege minigame to compare users number of staked Realms
export const fetchNumberRealmsStaked: (string) => Promise<number> = async (
  account: string
) => {
  const journeyContractV2 = new ethers.Contract(
    LORDS_JOURNEY_V2_ADDRESS,
    JourneyABI.abi,
    provider
  );

  try {
    const stakedInJourneyV1 = await journeyContract.getNumberRealms(account);
    const stakedInJourneyV2 = await journeyContractV2.getNumberRealms(account);
    return stakedInJourneyV1[0] + stakedInJourneyV2[0];
  } catch (e: any) {
    throw `Could not fetch numberRealmStaked: ${e.message}`;
  }
};
