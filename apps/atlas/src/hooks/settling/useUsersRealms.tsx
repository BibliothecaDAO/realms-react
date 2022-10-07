import { useAccount, useStarknetInvoke } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useCommandList } from '@/context/CommandListContext';
import type {
  GetRealmsQuery,
  RealmOrderByWithRelationInput,
  RealmWhereInput,
} from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useResources1155Contract } from '@/hooks/settling/stark-contracts';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { getAccountHex, RealmClaimable } from '@/shared/Getters/Realm';
import { useUiSounds, soundSelector } from '../useUiSounds';
import { useArmy } from './useArmy';
import { createResourcesCall } from './useResources';

interface UserRealmsDetailedData {
  attackingArmies?: ArmyAndOrder[];
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
  const { findRealmsAttackingArmies } = useArmy();
  const [userRealms, setUserRealms] = useState<GetRealmsQuery>();
  const [userData, setUserData] = useState<UserRealmsDetailedData>({
    attackingArmies: [],
    resourcesClaimable: false,
    relicsHeld: 0,
    resourcesAcrossEmpire: [],
  });
  const { address } = useAccount();
  const starknetWallet = address ? BigNumber.from(address).toHexString() : '';
  const txQueue = useCommandList();

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
      return userRealmsData.realms
        .filter((a) => RealmClaimable(a))
        .filter((a) => a.settledOwner === getAccountHex(address || '0x0'))
        ? true
        : false;
    };

    const relicsHeld = () => {
      return userRealmsData.realms.map((a) => a.relicsOwned).flat().length || 0;
    };

    const resourcesAcrossRealms = () => {
      const allResources =
        userRealmsData.realms
          .filter((a) => a.settledOwner === getAccountHex(address || '0x0'))
          .map((a) => a.resources)
          .flat() || [];

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
      attackingArmies: findRealmsAttackingArmies(userRealmsData.realms),
      resourcesClaimable: isClaimable(),
      relicsHeld: relicsHeld(),
      resourcesAcrossEmpire: resourcesAcrossRealms(),
    });
  }, [userRealmsData]);

  const claimAll = () => {
    play();

    userRealms?.realms
      ?.filter((a) => a.settledOwner === getAccountHex(address || '0x0'))
      .forEach((a) => {
        if (RealmClaimable(a)) {
          txQueue.add(
            createResourcesCall.claim({
              realmId: a.realmId,
            })
          );
        }
      });
  };
  const { contract } = useResources1155Contract();

  const {
    data: combatData,
    error,
    loading: combatLoading,
    invoke,
  } = useStarknetInvoke({
    contract: contract,
    method: 'burnBatch',
  });

  return {
    userRealms,
    claimAll,
    userData,
    burnAll: (args: { ids; amounts }) => {
      invoke({
        args: [
          address,
          args.ids.map((a) => bnToUint256(toBN(a))),
          args.amounts.map((a) => bnToUint256(toBN(a))),
        ],
        metadata: {
          action: 'burnAll',
          ...args,
        },
      });
    },
  };
};

export default useUsersRealms;
