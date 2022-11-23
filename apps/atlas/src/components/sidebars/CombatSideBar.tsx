import { OrderIcon, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';

import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, { useEffect, useState } from 'react';
import { ArmyCard } from '@/components/cards/realms/ArmyCard';
import { RaidResults } from '@/components/tables/RaidResults';

import { findResourceById } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army, GetRealmQuery, Realm } from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { useArmy, nameArray } from '@/hooks/settling/useArmy';
import useCombat from '@/hooks/settling/useCombat';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import {
  fetchRealmNameById,
  getDays,
  vaultResources,
} from '@/shared/Getters/Realm';
import { Battalion } from '@/shared/squad/Battalion';
import { BattalionWithImage } from '@/shared/squad/BattalionWithImage';
import { ArmyBattalionQty } from '@/types/index';
import { ArmyStatistics } from '../cards/realms/armyCard/ArmyStatistics';
import { RealmResources } from '../tables/RealmResources';

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

  const cachedVaultDaysAccrued = getDays(defendingRealm?.lastVaultTime);

  return (
    <div className="z-50 p-10">
      <div>
        {!raidButtonEnabled && selectedArmy && (
          <div className="p-2 my-2 text-xl text-orange-200 rounded bg-red-200/40 font-display">
            {isSameOrder && (
              <div>
                Ser, {fetchRealmNameById(selectedArmy.realmId)} is of the same
                order as {fetchRealmNameById(defendingRealm?.realmId)}. You
                cannot attack!
              </div>
            )}
          </div>
        )}
      </div>
      {!txSubmitted || combatError ? (
        <div className="grid w-full md:grid-cols-3 ">
          <div>
            <div className="">
              <div className="flex justify-center w-32 h-32 mx-auto bg-white border-4 border-yellow-600 border-double rounded-full shadow-xl shadow-rage">
                <OrderIcon
                  containerClassName="inline-block mr-4 self-center mx-auto"
                  size="lg"
                  order={selectedArmy?.orderType || ''}
                />
              </div>
              <h1 className="flex justify-center w-full py-4 text-center border-4 border-yellow-600 border-double rounded">
                {fetchRealmNameById(selectedArmy?.realmId)}
              </h1>
              <div className="grid grid-cols-4 gap-2 p-4 border-4 border-yellow-600 border-double">
                {battalions?.map((battalion, index) => {
                  return (
                    <BattalionWithImage
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
            <h3 className="mt-20">Armies at this Realm</h3>
            <div className="grid lg:grid-cols-1">
              {defendingRealm &&
                attackingRealmsAtLocation?.map((army, index) => {
                  return (
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
                  );
                })}
            </div>
          </div>
          <div className="self-start w-full lg:px-24">
            {/* <ArmyStatistics armyStatistics={attackingArmyStats} /> */}

            <div className="p-4 text-center border-4 border-yellow-600 border-double rounded">
              <h2 className="text-center">
                {vaultResources(cachedVaultDaysAccrued)}x
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
              className="w-full mt-6 text-3xl border-4 border-yellow-600 border-double font-lords"
            >
              Raid Vault
            </Button>
          </div>

          <div className="">
            <div className="flex justify-center w-32 h-32 mx-auto bg-white border-4 border-yellow-600 border-double rounded-full shadow-xl shadow-yellow-200">
              <OrderIcon
                containerClassName="inline-block mr-4 self-center mx-auto"
                size="lg"
                order={defendingRealm?.orderType || ''}
              />
            </div>
            <h1 className="flex justify-center w-full py-4 text-center border-4 border-yellow-600 border-double rounded">
              {defendingRealm?.name}
            </h1>
            <div className="grid grid-cols-4 gap-2 p-4 border-4 border-yellow-600 border-double">
              {battalions?.map((battalion, index) => {
                return (
                  <BattalionWithImage
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
          <div>
            {/* combatError && <p className="mt-3 text-red-400">combatError</p> */}
          </div>
        </div>
      ) : (
        <div>
          {/* <p>Tx Hash: {combatData} </p> */}
          <RaidResults
            fromAttackRealmId={selectedArmy?.realmId}
            tx={combatData?.transaction_hash}
          />
        </div>
      )}
    </div>
  );
};
