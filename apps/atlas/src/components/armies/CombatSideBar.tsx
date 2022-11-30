import { OrderIcon, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';

import ParentSize from '@visx/responsive/lib/components/ParentSize';
import React, { useEffect, useState } from 'react';
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
  vaultResources,
} from '@/components/realms/RealmsGetters';
import { findResourceById } from '@/constants/resources';

import { useAtlasContext } from '@/context/AtlasContext';
import type { Army, GetRealmQuery, Realm } from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { useArmy, nameArray } from '@/hooks/settling/useArmy';
import useCombat from '@/hooks/settling/useCombat';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { ArmyBattalionQty } from '@/types/index';

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
    <div className="z-50 bg-realmCombatBackground bg-cover p-16 bg-center">
      {/* <div>
        {!raidButtonEnabled && selectedArmy && (
          <div className="p-8 text-xl text-white rounded bg-red-900">
            {isSameOrder && (
              <div>
                Ser, {fetchRealmNameById(selectedArmy.realmId)} is of the same
                order as {fetchRealmNameById(defendingRealm?.realmId)}. You
                cannot attack!
              </div>
            )}
          </div>
        )}
      </div> */}
      {!txSubmitted || combatError ? (
        <div className="grid w-full md:grid-cols-3 ">
          <div>
            <ArmyDisplayContainer
              order={selectedArmy?.orderType}
              realmId={selectedArmy?.realmId}
              battalions={battalions}
              army={selectedArmy}
            />
          </div>
          <div className="self-start w-full lg:px-24">
            {/* <ArmyStatistics armyStatistics={attackingArmyStats} /> */}
            <div className=" text-center border-4 border-yellow-600 border-double rounded bg-black">
              {hasOwnRelic(defendingRealm) ? (
                <img src="/mj_relic.png" alt="" />
              ) : (
                ''
              )}
              <h5 className="my-3">
                {hasOwnRelic(defendingRealm) ? 'Relic vulnerable' : ''}
              </h5>
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
              className="w-full mt-6 text-3xl border-4 border-yellow-600 border-double"
            >
              Raid Vault
            </Button>
          </div>
          <ArmyDisplayContainer
            order={defendingRealm?.orderType}
            realmId={defendingRealm?.realmId}
            battalions={battalions}
            army={defendingRealmArmy}
          />
          <div>
            {/* combatError && <p className="mt-3 text-red-400">combatError</p> */}
          </div>
          <div className="col-span-full p-6 bg-black mt-20 rounded">
            <h3>Armies at this Realm</h3>
            <div className="grid lg:grid-cols-3">
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

export const ArmyDisplayContainer = ({ order, realmId, battalions, army }) => {
  return (
    <div>
      <div className="">
        <div className="flex justify-center w-16 h-16 mx-auto bg-black border-4 border-yellow-900 border-double rounded-t-2xl shadow-xl">
          <OrderIcon
            containerClassName="inline-block mr-4 self-center mx-auto"
            size="sm"
            order={order || ''}
          />
        </div>
        <div className="text-3xl bg-gray-1000 flex justify-center w-full py-4 text-center border-4 border-yellow-900 border-double rounded-t-2xl">
          {fetchRealmNameById(realmId)}
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
      </div>
    </div>
  );
};
