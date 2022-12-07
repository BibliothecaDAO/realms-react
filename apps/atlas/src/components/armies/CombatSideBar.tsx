import {
  OrderIcon,
  Button,
  ResourceIcon,
  Tabs,
  Table,
} from '@bibliotheca-dao/ui-lib';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import Head from '@bibliotheca-dao/ui-lib/icons/loot/head.svg';
import Map from '@bibliotheca-dao/ui-lib/icons/map.svg';
import { useAccount, useStarknet } from '@starknet-react/core';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, { useEffect, useMemo, useState } from 'react';
import { ArmyCard } from '@/components/armies/ArmyCard';
import { ArmyStatistics } from '@/components/armies/armyCard/ArmyStatistics';
import { RaidResults } from '@/components/armies/RaidResults';
import { Battalion } from '@/components/armies/squad/Battalion';
import { BattalionWithImage } from '@/components/armies/squad/BattalionWithImage';
import { RealmResources } from '@/components/realms/RealmResources';
import {
  fetchRealmNameById,
  getDays,
  hasOwnRelic,
  getRealmCombatStatus,
  vaultResources,
} from '@/components/realms/RealmsGetters';
import { findResourceById } from '@/constants/resources';

import { useAtlasContext } from '@/context/AtlasContext';
import type { Army, GetRealmQuery, Realm } from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { useArmy, nameArray } from '@/hooks/settling/useArmy';
import useCombat from '@/hooks/settling/useCombat';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useStarkNetId } from '@/hooks/useStarkNetId';
import { ArmyBattalionQty } from '@/types/index';
import { ArmyBattalions } from './armyCard/ArmyBattalions';
import { ArmyStatisticsTable } from './armyCard/ArmyStatisticsTable';
import { useCombatResult } from './useCombatResult';

type Prop = {
  defendingRealm?: GetRealmQuery['realm'];
  attackingArmy?: ArmyAndOrder;
};

export const CombatSideBar: React.FC<Prop> = ({
  defendingRealm,
  attackingArmy,
}) => {
  const { address } = useAccount();
  const { userData } = useUsersRealms();

  const {
    travelContext: { travel },
  } = useAtlasContext();

  const attackingRealmsAtLocation =
    userData.attackingArmies?.filter(
      (army) => army.destinationRealmId === defendingRealm?.realmId
    ) || [];

  const firstArmy = attackingRealmsAtLocation[0];

  const [selectedArmy, setSelectedArmy] = useState<ArmyAndOrder | undefined>(
    firstArmy
  );

  const [defendingRealmArmy, setDefendingRealmArmy] = useState<
    ArmyAndOrder | undefined
  >(defendingRealm?.ownArmies[0]);

  useMemo(() => {
    if (firstArmy) {
      setSelectedArmy(firstArmy);
    }
    console.log(firstArmy);
  }, [firstArmy]);

  // Can probably split using reduce function instead
  const attackingRealmsNotAtLocation = userData.attackingArmies?.filter(
    (army) => army.destinationRealmId !== defendingRealm?.realmId
  );

  // Client side validation
  const isSameOrder = defendingRealm?.orderType == selectedArmy?.orderType;

  const raidButtonEnabled = !!selectedArmy && !isSameOrder;

  const { initiateCombat, combatData, combatLoading, combatError } =
    useCombat();

  const [txSubmitted, setTxSubmitted] = useState(false);

  useEffect(() => {
    if (combatData) {
      setTxSubmitted(true);
    }
  }, [combatData]);

  const {
    result,
    attackingEndArmy,
    defendingEndArmy,
    loading: loadingResult,
  } = useCombatResult({
    fromAttackRealmId: selectedArmy?.realmId,
    fromDefendRealmId: defendingRealm?.realmId,
    tx: combatData?.transaction_hash,
  });

  useEffect(() => {
    if (combatData?.transaction_hash && !loadingResult && result) {
      setDefendingRealmArmy(defendingEndArmy);
      setSelectedArmy(attackingEndArmy);
    }

    // console.log(result);
  }, [result]);

  return (
    <div className="z-50 h-screen p-16 bg-center bg-cover bg-realmCombatBackground ">
      {/* {txSubmitted || combatError ? ( */}
      <div className="grid w-full md:grid-cols-3 ">
        <div>
          {!raidButtonEnabled && selectedArmy && (
            <div className="p-8 mb-4 text-xl text-white bg-red-900 rounded-3xl">
              {isSameOrder && (
                <div>
                  Ser, {fetchRealmNameById(selectedArmy.realmId)} is of the same
                  order as {fetchRealmNameById(defendingRealm?.realmId)}. You
                  cannot attack!
                </div>
              )}
            </div>
          )}

          <ArmyDisplayContainer
            order={selectedArmy?.orderType}
            realmId={selectedArmy?.realmId}
            army={selectedArmy}
            owner={address}
          />
        </div>
        <div className="self-start w-full lg:px-24">
          <RaidResultTable />
          {/* <div className="p-2 text-center bg-gray-1000 rounded-t-xl">
            <h1>Raid</h1>
          </div>
          <div className="py-10 text-center border-4 border-yellow-900 border-double rounded-b-full bg-gray-1000 ">
            {hasOwnRelic(defendingRealm) ? (
              <img src="/mj_relic.png" alt="" />
            ) : (
              ''
            )}
            <h5 className="my-3">
              {hasOwnRelic(defendingRealm) ? 'Relic vulnerable' : ''}
            </h5>
            <h2 className="text-center">
              {vaultResources(getDays(defendingRealm?.lastVaultTime))}x
            </h2>
            {defendingRealm?.resources?.map((re, index) => (
              <div
                key={index}
                className="flex flex-col justify-center p-2 mt-4"
              >
                <ResourceIcon
                  resource={
                    findResourceById(re.resourceId)?.trait.replace(' ', '') ||
                    ''
                  }
                  size="sm"
                />

                <span className="self-center mt-1">
                  {findResourceById(re.resourceId)?.trait}
                </span>
              </div>
            ))}
          </div>
          <Button
            onClick={() => {
              initiateCombat({
                attackingArmyId: selectedArmy?.armyId,
                attackingRealmId: selectedArmy?.realmId,
                defendingRealmId: defendingRealm?.realmId,
              });
            }}
            loading={combatLoading}
            loadingText={'Raiding'}
            disabled={!raidButtonEnabled}
            variant="primary"
            size="lg"
            className="w-full mt-6 text-3xl border-4 border-yellow-600 border-double"
          >
            Plunder!
          </Button> */}
        </div>

        <ArmyDisplayContainer
          order={defendingRealm?.orderType}
          realmId={defendingRealm?.realmId}
          army={defendingRealmArmy}
          owner={defendingRealm?.ownerL2}
        />
        <div>
          {/* combatError && <p className="mt-3 text-red-400">combatError</p> */}
        </div>
        {/* <div className="p-6 mt-20 rounded bg-gray-1000 col-span-full">
          <h3>Armies at this Realm</h3>
          <div className="grid gap-2 lg:grid-cols-3">
            {defendingRealm &&
              attackingRealmsAtLocation?.map((army, index) => {
                return (
                  <button onClick={() => setSelectedArmy(army)} key={index}>
                    <ArmyCard
                      army={army}
                      selectedRealm={defendingRealm?.realmId}
                      onTravel={() =>
                        travel(
                          army.armyId,
                          army.realmId,
                          defendingRealm.realmId
                        )
                      }
                    />
                  </button>
                );
              })}
          </div>
        </div> */}
      </div>

      {/* <div>
        loading
        <RaidResults
          fromAttackRealmId={selectedArmy?.realmId}
          tx={combatData?.transaction_hash}
        />
      </div> */}
    </div>
  );
};

export const ArmyDisplayContainer = ({ order, realmId, army, owner }) => {
  const { battalions } = useArmy();
  const [selectedTab, setSelectedTab] = useState(0);

  const pressedTab = (index) => {
    setSelectedTab(index as number);
  };

  const tabs = useMemo(
    () => [
      {
        label: <Map className="self-center w-3 h-3 fill-current" />,
        component: <ArmyStatisticsTable army={army} />,
      },
      {
        label: <Head className="self-center w-3 h-3 fill-current" />,
        component: <ArmyBattalions army={army} />,
      },
    ],
    [army]
  );

  return (
    <div>
      <div className="">
        <div className="flex justify-start w-full py-4 text-3xl text-center border-4 border-yellow-900 border-double bg-gray-1000 rounded-t-2xl">
          {/* <span>{starknetId}</span> */}
          <OrderIcon
            containerClassName="inline-block mx-4"
            size="md"
            order={order || ''}
          />{' '}
          <span className="self-center">{fetchRealmNameById(realmId)}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 p-4 border-4 border-yellow-900 border-double bg-gray-1000 rounded-b-2xl">
          {battalions?.map((battalion, index) => {
            return (
              <>
                {army && army[nameArray[index] + 'Qty'] > 0 && (
                  <BattalionWithImage
                    key={index}
                    {...battalion}
                    quantity={army ? army[nameArray[index] + 'Qty'] : ''}
                    health={army ? army[nameArray[index] + 'Health'] : ''}
                  />
                )}
              </>
            );
          })}
        </div>
        <div className="w-full p-4 mt-3 border-4 border-yellow-900 border-double bg-gray-1000 rounded-2xl">
          <Tabs
            selectedIndex={selectedTab}
            onChange={(index) => pressedTab(index as number)}
            variant="small"
          >
            <Tabs.List className="">
              {tabs.map((tab, index) => (
                <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
              ))}
            </Tabs.List>

            <Tabs.Panels>
              {tabs.map((tab, index) => (
                <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
              ))}
            </Tabs.Panels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export const RaidResultTable = () => {
  const army = {
    __typename: 'Army',
    armyId: 1,
    realmId: 54,
    xp: 0,
    destinationRealmId: 24,
    destinationArrivalTime: 1670330023000,
    armyPacked: 0,
    lastAttacked: null,
    level: 0,
    callSign: 0,
    lightCavalryQty: 10,
    lightCavalryHealth: 100,
    heavyCavalryQty: 0,
    heavyCavalryHealth: 0,
    archerQty: 10,
    archerHealth: 100,
    longbowQty: 0,
    longbowHealth: 0,
    mageQty: 0,
    mageHealth: 0,
    arcanistQty: 0,
    arcanistHealth: 0,
    lightInfantryQty: 0,
    lightInfantryHealth: 0,
    heavyInfantryQty: 10,
    heavyInfantryHealth: 100,
    orderType: 'Fury',
  };
  const combatTable = () => {
    return {
      lord: 'squid',
      deployed: [{ name: 'squid', quantity: 1 }],
      losses: [{ name: 'squid', quantity: 1 }],
      remaining: 2,
    };
  };

  return (
    <div className="p-2 rounded bg-gray-1000">
      <table className="w-full">
        <thead>
          <tr>
            <th>Lord</th>
            <th>Deployed</th>
            <th>Losses</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{combatTable().lord}</td>
            <td>{combatTable().lord}</td>
            <td>{combatTable().lord}</td>
            <td>{combatTable().lord}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
