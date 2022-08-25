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

interface UserRealmsDetailedData {
  resourcesClaimable: boolean;
  relicsHeld: number;
  resourcesAcrossEmpire: Resource[];
}

interface Resource {
  resourceName: string;
  resourceCount: number;
}
const useUsersRealms = () => {
  const { play } = useUiSounds(soundSelector.claim);
  const [userRealms, setUserRealms] = useState<GetRealmsQuery>();
  const [userData, setUserData] = useState<UserRealmsDetailedData>({
    resourcesClaimable: false,
    relicsHeld: 0,
    resourcesAcrossEmpire: [],
  });
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

    const isClaimable = () => {
      return userRealmsData.realms.filter((a) => RealmClaimable(a))
        ? true
        : false;
    };

    const relicsHeld = () => {
      return userRealmsData.realms.map((a) => a.relicsOwned).flat().length || 0;
    };

    const resourcesAcrossRealms = () => {
      const allResources =
        userRealmsData.realms.map((a) => a.resources).flat() || [];

      const countUnique = (arr) => {
        const counts = {};
        for (let i = 0; i < arr.length; i++) {
          counts[arr[i]['resourceName']] =
            1 + (counts[arr[i]['resourceName']] || 0);
        }
        return Object.keys(counts).map((a) => {
          return {
            resourceName: a,
            resourceCount: counts[a],
          };
        });
      };

      return countUnique(allResources);
    };

    setUserData({
      resourcesClaimable: isClaimable(),
      relicsHeld: relicsHeld(),
      resourcesAcrossEmpire: resourcesAcrossRealms(),
    });
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

  return { userRealms, claimAll, userData };
};

export default useUsersRealms;
