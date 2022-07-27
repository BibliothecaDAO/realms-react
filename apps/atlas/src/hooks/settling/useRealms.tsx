import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import type { RealmWhereInput } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';

const MyRealms = 'My Realms';

// TODO: Get lists from local storage
const staticLists = [MyRealms];

const useRealms = () => {
  const { account: starkAccount } = useStarknet();
  const starknetWallet = starkAccount
    ? BigNumber.from(starkAccount).toHexString()
    : '';

  const filter: RealmWhereInput = {};
  // filter.OR = [
  //   { owner: { equals: account?.toLowerCase() } },
  //   { bridgedOwner: { equals: account?.toLowerCase() } },
  //   { ownerL2: { equals: starknetWallet } },
  //   { settledOwner: { equals: starknetWallet } },
  // ];
  filter.settledOwner = {
    equals: starknetWallet,
  };

  const { data, loading, error } = useGetRealmsQuery({
    variables: {
      filter,
      take: 10,
    },
  });
  return { data, loading, error };
};

export default useRealms;
