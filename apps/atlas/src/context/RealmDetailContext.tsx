/* eslint-disable @typescript-eslint/no-empty-function */
import { useStarknet, useStarknetCall } from '@starknet-react/core';

import { useRouter } from 'next/router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import { useGetExchangeRatesQuery } from '@/generated/graphql';
import {
  useLordsContract,
  useResources1155Contract,
  useExchangeContract,
  useBuildingContract,
  useFoodContract,
} from '@/hooks/settling/stark-contracts';
import { resources } from '@/util/resources';

const RealmContext = createContext<{
  account: string | undefined;
  buildings: Building[] | undefined;
  loading: boolean;
  availableFood: string | undefined;
}>(null!);

interface RealmDetailProviderProps {
  children: React.ReactNode;
}

interface Building {
  name: string;
  id: number;
  quantityBuilt: number;
  img: string;
  type: string;
}

export const RealmDetailProvider = (props: RealmDetailProviderProps) => {
  return (
    <RealmContext.Provider value={useRealm()}>
      {props.children}
    </RealmContext.Provider>
  );
};

function useRealm() {
  const router = useRouter();
  const { account } = useStarknet();
  const { contract: buildingContract } = useBuildingContract();
  const { contract: foodContract } = useFoodContract();
  const [buildings, setBuildings] = useState<Building[]>();
  const [availableFood, setAvailableFood] = useState();

  const realmId = router.asPath.split('/')[2].split('?')[0];

  const {
    data: foodData,
    loading: foodLoadingData,
    error: foodError,
  } = useStarknetCall({
    contract: foodContract,
    method: 'available_food_in_store',
    args: [bnToUint256(toBN(realmId))],
  });

  const {
    data: allOutputData,
    loading,
    error: outputError,
  } = useStarknetCall({
    contract: buildingContract,
    method: 'get_effective_buildings',
    args: [bnToUint256(toBN(realmId))],
  });

  useEffect(() => {
    if (!allOutputData || !allOutputData[0] || !foodData || !foodData[0]) {
      return;
    }
    setAvailableFood(foodData[0].toNumber());
    setBuildings([
      {
        name: 'Archer Tower',
        id: 8,
        quantityBuilt: allOutputData[0].ArcherTower.toNumber(),
        img: '/barracks.png',
        type: 'military',
      },
      {
        name: 'Barracks',
        id: 6,
        quantityBuilt: allOutputData[0].Barracks.toNumber(),
        img: '/barracks.png',
        type: 'military',
      },
      {
        name: 'Castle',
        id: 9,
        quantityBuilt: allOutputData[0].Castle.toNumber(),
        img: '/barracks.png',
        type: 'military',
      },
      {
        name: 'Farm',
        id: 4,
        quantityBuilt: allOutputData[0].Farm.toNumber(),
        img: '/barracks.png',
        type: 'economic',
      },
      {
        name: 'Fishing Village',
        id: 5,
        quantityBuilt: allOutputData[0].FishingVillage.toNumber(),
        img: '/barracks.png',
        type: 'economic',
      },
      {
        name: 'House',
        id: 1,
        quantityBuilt: allOutputData[0].House.toNumber(),
        img: '/barracks.png',
        type: 'economic',
      },
      {
        name: 'MageTower',
        id: 7,
        quantityBuilt: allOutputData[0].MageTower.toNumber(),
        img: '/barracks.png',
        type: 'military',
      },
      {
        name: 'Store House',
        id: 2,
        quantityBuilt: allOutputData[0].StoreHouse.toNumber(),
        img: '/barracks.png',
        type: 'economic',
      },
    ]);

    console.log(availableFood);
  }, [allOutputData, realmId, availableFood]);

  return {
    account,
    buildings,
    loading,
    availableFood,
  };
}

export function useRealmContext() {
  return useContext(RealmContext);
}
