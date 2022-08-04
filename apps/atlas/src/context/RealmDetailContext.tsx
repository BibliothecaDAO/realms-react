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
} from '@/hooks/settling/stark-contracts';
import { resources } from '@/util/resources';

const RealmContext = createContext<{
  account: string | undefined;
  buildings: RealmBuildings | undefined;
}>(null!);

interface RealmDetailProviderProps {
  children: React.ReactNode;
}

interface RealmBuildings {
  ArcherTower: string;
  Barracks: string;
  Castle: string;
  Farm: string;
  FishingVillage: string;
  Granary: string;
  House: string;
  MageTower: string;
  StoreHouse: string;
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
  const [buildings, setBuildings] = useState<RealmBuildings>();

  const realmId = router.asPath.split('/')[2].split('?')[0];

  const {
    data: allOutputData,
    loading: outputLoading,
    error: outputError,
  } = useStarknetCall({
    contract: buildingContract,
    method: 'get_effective_buildings',
    args: [bnToUint256(toBN(realmId))],
  });

  useEffect(() => {
    if (!allOutputData || !allOutputData[0]) {
      return;
    }

    setBuildings({
      ArcherTower: allOutputData[0].ArcherTower.toNumber(),
      Barracks: allOutputData[0].Barracks.toNumber(),
      Castle: allOutputData[0].Castle.toNumber(),
      Farm: allOutputData[0].Farm.toNumber(),
      FishingVillage: allOutputData[0].FishingVillage.toNumber(),
      Granary: allOutputData[0].Granary.toNumber(),
      House: allOutputData[0].House.toNumber(),
      MageTower: allOutputData[0].MageTower.toNumber(),
      StoreHouse: allOutputData[0].StoreHouse.toNumber(),
    });
  }, [allOutputData]);

  return {
    account,
    buildings,
  };
}

export function useRealmContext() {
  return useContext(RealmContext);
}
