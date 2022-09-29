import {
  OrderIcon,
  Button,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';

import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, { useEffect, useState } from 'react';
import { ArmyCard } from '@/components/cards/realms/ArmyCard';
import { RaidResults } from '@/components/tables/RaidResults';

import { useAtlasContext } from '@/context/AtlasContext';
import type { GetRealmQuery } from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { useArmy, nameArray } from '@/hooks/settling/useArmy';
import useCombat from '@/hooks/settling/useCombat';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import RealmSelector from '@/shared/RealmSelector';
import { Battalion } from '@/shared/squad/Battalion';

type Prop = {
  defendingRealm?: GetRealmQuery['realm'];
  attackingArmy?: ArmyAndOrder;
};

export const CombatSideBar: React.FC<Prop> = ({
  defendingRealm,
  attackingArmy,
}) => {
  const { userData } = useUsersRealms();
  const { battalions, getArmyStats } = useArmy();

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

  useEffect(() => {
    if (firstArmy) {
      setSelectedArmy(firstArmy);
    }
  }, [firstArmy]);

  const defendingRealmArmy = defendingRealm?.ownArmies[0];
  const defendingArmyStats = getArmyStats(defendingRealmArmy);
  const attackingArmyStats = getArmyStats(selectedArmy);
  // Can probably split using reduce function instead
  const attackingRealmsNotAtLocation = userData.attackingArmies?.filter(
    (army) => army.destinationRealmId !== defendingRealm?.realmId
  );

  // Client side validation
  const isSameOrder = defendingRealm?.orderType == selectedArmy?.orderType;
  /* const attackRealmHasAttackSquad =
    attackingRealm?.troops &&
    attackingRealm.troops.filter((t) => t.squadSlot == Squad['Attack']).length >
      0; */
  // TODO: Attacking army cooldown has expired

  const raidButtonEnabled = !!selectedArmy && !isSameOrder;

  const { initiateCombat, combatData, combatLoading, combatError } =
    useCombat();

  const [txSubmitted, setTxSubmitted] = useState(false);

  useEffect(() => {
    if (combatData) {
      setTxSubmitted(true);
    }
  }, [combatData]);

  return (
    <div>
      {(!txSubmitted || combatError) && (
        <>
          <div className="grid w-full md:grid-cols-3">
            <div>
              <div className="">
                <h1 className="w-full mb-8 text-center">
                  {selectedArmy?.realmId}
                  <OrderIcon
                    withTooltip
                    containerClassName="inline-block mr-4"
                    size="md"
                    order={selectedArmy?.orderType || ''}
                  />
                </h1>
                <div className="grid grid-cols-2">
                  {battalions?.map((battalion, index) => {
                    return (
                      <Battalion
                        key={index}
                        {...battalion}
                        quantity={
                          selectedArmy
                            ? selectedArmy[nameArray[index] + 'Qty']
                            : ''
                        }
                        health={
                          selectedArmy
                            ? selectedArmy[nameArray[index] + 'Health']
                            : ''
                        }
                      />
                    );
                  })}
                </div>
              </div>
              <h2 className="mt-4">Armies at this Realm</h2>
              <div className="grid lg:grid-cols-2">
                {defendingRealm &&
                  attackingRealmsAtLocation?.map((army, index) => {
                    return (
                      // <div onClick={() => setSelectedArmy(army)} key={index}>
                      <ArmyCard
                        key={index}
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
                      // </div>
                    );
                  })}
              </div>
            </div>
            <div className="w-full lg:px-24">
              <h1 className="pb-20 mt-4 text-center">Raiding</h1>
              <div className="w-full h-60">
                <ParentSize>
                  {({ width, height }) => (
                    <RadarMap
                      armyOne={defendingArmyStats}
                      armyTwo={attackingArmyStats}
                      height={height}
                      width={width}
                    />
                  )}
                </ParentSize>
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
                className="w-full mt-6 text-3xl border-4 border-yellow-600 border-double font-lords"
              >
                Raid
              </Button>
            </div>
            <div className="">
              <h1 className="w-full mb-8 text-center">
                {defendingRealm?.name}
                <OrderIcon
                  withTooltip
                  containerClassName="inline-block mr-4"
                  size="md"
                  order={defendingRealm?.orderType || ''}
                />
              </h1>
              <div className="grid grid-cols-2">
                {battalions?.map((battalion, index) => {
                  return (
                    <Battalion
                      key={index}
                      {...battalion}
                      quantity={
                        defendingRealmArmy
                          ? defendingRealmArmy[nameArray[index] + 'Qty']
                          : ''
                      }
                      health={
                        defendingRealmArmy
                          ? defendingRealmArmy[nameArray[index] + 'Health']
                          : ''
                      }
                    />
                  );
                })}
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-2 divide-x-4 divide-dotted ">
            <SquadStatistics
              slot={TroopSlot.defending}
              troops={realm?.troops || []}
            />
          </div>
           <RealmSelector onSelect={(r) => setSelectedRealms(r)} /> 
          <Button
            onClick={() => {
              initiateCombat({
                attackingRealmId: selectedRealms[0]?.realmId,
                defendingRealmId: realm?.realmId,
              });
            }}
            loading={combatLoading}
            loadingText={'Raiding'}
            disabled={!raidButtonEnabled}
            variant="primary"
            size="lg"
            className="w-full mt-2 border-4 border-yellow-600 border-double"
          >
            pillage {realm?.name}
          </Button> */}
            <p className="mt-3 text-red-400">{combatError}</p>
            {!raidButtonEnabled && selectedArmy && (
              <div className="p-2 my-2 font-semibold text-orange-800 bg-red-200 rounded">
                {isSameOrder && (
                  <p>
                    Ser, {selectedArmy.armyId} cannot Attack a Realm of the same
                    order!
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {txSubmitted && (
        <div>
          {/* <p>Tx Hash: {combatData} </p> */}
          <RaidResults
            fromAttackRealmId={selectedArmy?.armyId}
            tx={combatData}
          />
        </div>
      )}
    </div>
  );
};
