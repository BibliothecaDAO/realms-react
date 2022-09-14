import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { RaidResults } from '@/components/tables/RaidResults';
import { Squad } from '@/constants/index';
import { TroopSlot } from '@/constants/troops';
import type { GetRealmQuery, GetRealmsQuery } from '@/generated/graphql';
import useCombat from '@/hooks/settling/useCombat';
import RealmSelector from '@/shared/RealmSelector';
import SquadStatistics from '@/shared/squad/SquadStatistics';

type Prop = {
  realm?: GetRealmQuery['realm'];
};

export const RaidingSideBar: React.FC<Prop> = (props) => {
  const realm = props.realm;

  const [selectedRealms, setSelectedRealms] = useState<
    GetRealmsQuery['realms']
  >([]);
  const attackingRealm =
    selectedRealms.length > 0 ? selectedRealms[0] : undefined;

  // Client side validation
  const isSameOrder = realm?.orderType == attackingRealm?.orderType;
  const attackRealmHasAttackSquad =
    attackingRealm?.troops &&
    attackingRealm.troops.filter((t) => t.squadSlot == Squad['Attack']).length >
      0;
  // TODO: Attacking army cooldown has expired

  const raidButtonEnabled =
    !!attackingRealm && !isSameOrder && attackRealmHasAttackSquad;

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
        <div>
          <div className="flex justify-between mt-4">
            <div className="w-1/2 ">
              <div className="p-2">
                <h2>
                  <OrderIcon
                    withTooltip
                    containerClassName="inline-block mr-4"
                    size="md"
                    order={realm?.orderType || ''}
                  />
                  {realm?.name}
                </h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 divide-x-4 divide-dotted ">
            <SquadStatistics
              slot={TroopSlot.defending}
              troops={realm?.troops || []}
            />
          </div>
          {/* <RealmSelector onSelect={(r) => setSelectedRealms(r)} /> */}
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
          </Button>
          <p className="mt-3 text-red-400">{combatError}</p>
          {!raidButtonEnabled && attackingRealm && (
            <div className="p-2 my-2 font-semibold text-orange-800 bg-red-200 rounded">
              {isSameOrder && (
                <p>
                  Ser, {attackingRealm.name} cannot Attack a Realm of the same
                  order!
                </p>
              )}
              {!attackRealmHasAttackSquad && (
                <p>
                  Ser, {attackingRealm.name} has not trained an Attacking Army!
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {txSubmitted && (
        <div>
          {/* <p>Tx Hash: {combatData} </p> */}
          <RaidResults defendId={realm?.realmId} tx={combatData} />
        </div>
      )}
    </div>
  );
};
