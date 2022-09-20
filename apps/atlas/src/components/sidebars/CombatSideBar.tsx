import {
  OrderIcon,
  Button,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';

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

type Prop = {
  defendingRealm?: GetRealmQuery['realm'];
  attackingArmy?: ArmyAndOrder;
};

export const CombatSideBar: React.FC<Prop> = ({
  defendingRealm,
  attackingArmy,
}) => {
  const { userAttackingArmies } = useUsersRealms();
  const { battalions, getArmyStats } = useArmy();

  const {
    travelContext: { travel },
  } = useAtlasContext();

  const attackingRealmsAtLocation =
    userAttackingArmies?.filter(
      (army) => army.destinationRealmId === defendingRealm?.realmId
    ) || [];

  const [selectedArmy, setSelectedArmy] = useState<ArmyAndOrder | undefined>(
    attackingRealmsAtLocation[0]
  );

  useEffect(() => {
    if (attackingArmy) {
      setSelectedArmy(attackingArmy);
    } else if (attackingRealmsAtLocation.length) {
      setSelectedArmy(attackingRealmsAtLocation[0]);
    }
  }, [attackingArmy, attackingRealmsAtLocation]);

  const defendingRealmArmy = defendingRealm?.ownArmies[0];
  const defendingArmyStats = getArmyStats(defendingRealmArmy);

  // Can probably split using reduce function instead
  const attackingRealmsNotAtLocation = userAttackingArmies?.filter(
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
    console.log(combatData);
  }, [combatData]);

  return (
    <div>
      {(!txSubmitted || combatError) && (
        <div className="grid grid-cols-3">
          <div>
            <h2 className="mt-4">Armies at this Realm</h2>
            {defendingRealm &&
              attackingRealmsAtLocation?.map((army, index) => {
                return (
                  <>
                    <OrderIcon
                      withTooltip
                      containerClassName="inline-block mr-4"
                      size="md"
                      order={army.orderType || ''}
                    />
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
                  </>
                );
              })}

            <h2 className="mt-4">Armies elsewhere</h2>
          </div>
          <div className="mx-auto">
            <RadarMap armyOne={defendingArmyStats} height={400} width={400} />
            same order: {isSameOrder.toString()}
            army id: {selectedArmy?.armyId}
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
              className="w-full mt-6 border-4 border-yellow-600 border-double"
            >
              Attack
            </Button>
          </div>
          <div className="flex justify-between mt-4">
            <div className="w-1/2 ">
              <div className="p-2">
                <h2>
                  <OrderIcon
                    withTooltip
                    containerClassName="inline-block mr-4"
                    size="md"
                    order={defendingRealm?.orderType || ''}
                  />
                  {defendingRealm?.name}
                </h2>
                <div className="grid grid-cols-2">
                  {battalions?.map((battalion, index) => {
                    return (
                      <Card
                        key={battalion.battalionId}
                        className={`relative flex-col group `}
                      >
                        <CardTitle className="flex justify-center text-center">
                          {battalion.battalionName}
                        </CardTitle>
                        <CardBody>
                          <div className="flex justify-center space-x-3 text-center">
                            <div className="px-4 border-r">
                              <h5 className="">qty</h5>
                              <h1>
                                {defendingRealmArmy
                                  ? defendingRealmArmy[nameArray[index] + 'Qty']
                                  : 0}
                              </h1>
                            </div>
                            <div className="pr-4">
                              <h5 className="">health</h5>
                              <h1>
                                {defendingRealmArmy
                                  ? defendingRealmArmy[
                                      nameArray[index] + 'Health'
                                    ]
                                  : ''}
                              </h1>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </div>
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
      )}
      {txSubmitted && (
        <div>
          {/* <p>Tx Hash: {combatData} </p> */}
          <RaidResults defendId={defendingRealm?.realmId} tx={combatData} />
        </div>
      )}
    </div>
  );
};
