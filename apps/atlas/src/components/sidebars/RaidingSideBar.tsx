import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import React, { useEffect, useState } from 'react';
import { RaidResults } from '@/components/tables/RaidResults';
import { Squad } from '@/constants/index';
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
          <RealmSelector onSelect={(r) => setSelectedRealms(r)} />
          <div className="flex justify-between">
            <div className="w-1/2 p-3 bg-black rounded">
              <h5 className="mb-4">Defender</h5>
              <h3>
                <OrderIcon
                  withTooltip
                  containerClassName="inline-block"
                  size="sm"
                  order={realm?.orderType || ''}
                />
                {realm?.name}
              </h3>
            </div>
            <div className="w-1/2 p-3 bg-black rounded">
              <h5 className="mb-4">Attacker</h5>
              <h3>
                {attackingRealm && (
                  <OrderIcon
                    containerClassName="inline-block"
                    withTooltip
                    size="sm"
                    order={attackingRealm?.orderType}
                  />
                )}{' '}
                {attackingRealm?.name}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 divide-x-4 divide-dotted ">
            <SquadStatistics troops={realm?.troops || []}></SquadStatistics>
            {attackingRealm ? (
              <SquadStatistics
                className="pl-4"
                reversed
                troops={attackingRealm?.troops || []}
              ></SquadStatistics>
            ) : (
              <div className="flex items-center justify-center">
                Select <br />
                Realm
              </div>
            )}
          </div>

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
            className="w-full mt-2"
          >
            raid raid for war!!!!!!
          </Button>
          <p className="mt-3 text-red-400">{combatError}</p>
          {!raidButtonEnabled && attackingRealm && (
            <div className="p-2 my-2 text-orange-800 bg-red-200 rounded">
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
