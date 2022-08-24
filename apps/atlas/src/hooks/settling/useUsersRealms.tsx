import { useStarknet } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type {
  GetRealmsQuery,
  RealmOrderByWithRelationInput,
  RealmWhereInput,
} from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { RealmClaimable } from '@/shared/Getters/Realm';
import { useUiSounds, soundSelector } from '../useUiSounds';
import { createResourcesCall } from './useResources';

type UserRealmsDetailedData = {
  relicsCaptured: number;
};

const useUsersRealms = () => {
  const { play } = useUiSounds(soundSelector.claim);
  const [userRealms, setUserRealms] = useState<GetRealmsQuery>();
  const { account } = useStarknet();
  const starknetWallet = account ? BigNumber.from(account).toHexString() : '';
  const txQueue = useTransactionQueue();

  const variables = useMemo(() => {
    const filter = {} as any;

    filter.OR = [
      { ownerL2: { equals: starknetWallet } },
      { settledOwner: { equals: starknetWallet } },
    ];

    return {
      filter,
      take: 50,
    };
  }, [starknetWallet]);

  const {
    data: userRealmsData,
    loading: userLoading,
    refetch,
  } = useGetRealmsQuery({
    variables,
    skip: false,
  });

  useEffect(() => {
    if (!userRealmsData) {
      return;
    }
    setUserRealms(userRealmsData);
  }, [userRealmsData]);

  const claimAll = () => {
    play();

    userRealms?.realms?.forEach((a) => {
      if (RealmClaimable(a)) {
        txQueue.add(
          createResourcesCall.claim({
            realmId: a.realmId,
          })
        );
      }
    });
  };

  const isClaimable = () => {
    return userRealms?.realms.filter((a) => RealmClaimable(a)).length
      ? true
      : false;
  };

  return { userRealms, claimAll, isClaimable };
};

export default useUsersRealms;