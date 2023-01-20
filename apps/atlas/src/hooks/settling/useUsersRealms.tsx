import { useAccount, useStarknetInvoke } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { number, uint256 } from 'starknet';
import { getAttackingArmies } from '@/components/armies/ArmyGetters';
import {
  getAccountHex,
  RealmClaimable,
} from '@/components/realms/RealmsGetters';
import { useCommandList } from '@/context/CommandListContext';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { GetRealmsQuery } from '@/generated/graphql';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useResources1155Contract } from '@/hooks/settling/stark-contracts';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
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
  const { userRealms } = useUserBalancesContext();
  const { play } = useUiSounds(soundSelector.claim);
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

  useEffect(() => {
    if (!userRealms) {
      return;
    }

    const isClaimable = () => {
      return userRealms.realms
        .filter((a) => RealmClaimable(a))
        .filter((a) => a.settledOwner === getAccountHex(address || '0x0'))
        .length
        ? true
        : false;
    };

    const relicsHeld = () => {
      return userRealms.realms.map((a) => a.relicsOwned).flat().length || 0;
    };

    const resourcesAcrossRealms = () => {
      const allResources =
        userRealms.realms
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
      attackingArmies: getAttackingArmies(userRealms.realms),
      resourcesClaimable: isClaimable(),
      relicsHeld: relicsHeld(),
      resourcesAcrossEmpire: resourcesAcrossRealms(),
    });
  }, [userRealms, address]);

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
          args.ids.map((a) => uint256.bnToUint256(number.toBN(a))),
          args.amounts.map((a) => uint256.bnToUint256(number.toBN(a))),
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
