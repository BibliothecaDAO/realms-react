import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import type { RealmWhereInput } from '@/generated/graphql';
import type { Args } from './useRealms';
import useRealms from './useRealms';

const useMySettledRealms = (args: Omit<Args, 'filter'>) => {
  const { account: starkAccount } = useStarknet();
  const starknetWallet = starkAccount
    ? BigNumber.from(starkAccount).toHexString()
    : '';

  const filter: RealmWhereInput = {};

  // TO GET OWNER ACROSS L1-L2 USE
  // filter.OR = [
  //   { owner: { equals: account?.toLowerCase() } },
  //   { bridgedOwner: { equals: account?.toLowerCase() } },
  //   { ownerL2: { equals: starknetWallet } },
  //   { settledOwner: { equals: starknetWallet } },
  // ];

  filter.settledOwner = { equals: starknetWallet };

  return useRealms({ filter, ...args });
};

export default useMySettledRealms;
