import useCountdown from '@bibliotheca-dao/core-lib/hooks/use-countdown';
import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import React, { useEffect, useState } from 'react';
import AtlasSidebar from '@/components/sidebars/AtlasSideBar';
import { RealmResources } from '@/components/tables/RealmResources';
import { Squad } from '@/constants/index';
import { useGetTroopStatsQuery } from '@/generated/graphql';
import type { GetRealmQuery, GetRealmsQuery } from '@/generated/graphql';
import useCombat from '@/hooks/settling/useCombat';
import useIsOwner from '@/hooks/useIsOwner';
import RealmSelector from '@/shared/RealmSelector';
import SidebarHeader from '@/shared/SidebarHeader';
import { SquadBuilder } from '@/shared/squad/Squad';
import SquadStatistics from '@/shared/squad/SquadStatistics';

type Prop = {
  realm?: GetRealmQuery['realm'];
};

const Army: React.FC<Prop> = (props) => {
  const realm = props.realm;

  // Always initialize with defending army
  const [squadSlot, setSquadSlot] = useState<keyof typeof Squad>('Defend');

  const [selectedRealms, setSelectedRealms] = useState<
    GetRealmsQuery['realms']
  >([]);

  const timeAttacked = realm?.lastAttacked
    ? new Date(parseInt(realm.lastAttacked)).getTime()
    : 0;

  const cooldownMinutes = 30;

  const time = () => {
    const cooldown = 60 * cooldownMinutes;
    return (timeAttacked + cooldown).toString();
  };

  const countdown = useCountdown({ date: time() });

  const { initiateCombat } = useCombat();

  const [isRaiding, setIsRaiding] = useState(false);

  const isOwner = useIsOwner(realm?.settledOwner);

  useEffect(() => {
    setSquadSlot('Defend');
  }, [realm?.realmId]);

  const { data: troopStatsData } = useGetTroopStatsQuery();
  if (!realm) {
    return null;
  }
  const troops =
    realm.troops?.filter((squad) => squad.squadSlot === Squad[squadSlot]) ?? [];

  const attackingRealm =
    selectedRealms.length > 0 ? selectedRealms[0] : undefined;

  // Client side validation
  const isSameOrder = realm.orderType == attackingRealm?.orderType;
  const attackRealmHasAttackSquad =
    attackingRealm?.troops &&
    attackingRealm.troops.filter((t) => t.squadSlot == Squad['Attack']).length >
      0;

  const raidButtonEnabled =
    !!attackingRealm && !isSameOrder && attackRealmHasAttackSquad;

  return (
    <>
      <div className="px-2 py-1 font-semibold tracking-widest bg-gray-800">
        <h3>{squadSlot}ing Army</h3>
        {isOwner ? (
          <button
            onClick={() =>
              setSquadSlot((prev) => (prev == 'Attack' ? 'Defend' : 'Attack'))
            }
            className="text-blue-300 hover:underline"
          >
            View {squadSlot == 'Attack' ? 'Defend' : 'Attack'}ing Army
          </button>
        ) : null}
      </div>
      <SquadBuilder
        squad={squadSlot}
        realm={realm}
        withPurchase={true}
        troops={troops}
        troopsStats={troopStatsData?.getTroopStats}
      />
      <AtlasSidebar isOpen={isRaiding}>
        <SidebarHeader
          title="Raiding Plan"
          onClose={() => setIsRaiding(false)}
        ></SidebarHeader>
        <h3>Attacking Realm</h3>
        <RealmSelector onSelect={(r) => setSelectedRealms(r)} />
        <div className="flex justify-between">
          <h3>
            Defender{' '}
            <OrderIcon
              withTooltip
              className="inline-block"
              size="sm"
              order={realm.orderType}
            />
          </h3>
          <h3>
            {attackingRealm && (
              <OrderIcon
                withTooltip
                size="sm"
                order={attackingRealm?.orderType}
              />
            )}{' '}
            Attacker
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 divide-x-2 divide-dotted divide-slate-200">
          <SquadStatistics troops={realm.troops || []}></SquadStatistics>
          {attackingRealm ? (
            <SquadStatistics
              className="pl-2"
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
              defendingRealmId: realm.realmId,
            });
          }}
          disabled={!raidButtonEnabled}
          variant="primary"
          className="w-full mt-2"
        >
          Start Raid
        </Button>
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
      </AtlasSidebar>
      <div className="col-span-6 md:col-start-3 md:col-end-5">
        <RealmResources
          header={
            <>
              <h3>Vault</h3>{' '}
              {!isOwner && (
                <Button
                  onClick={() => setIsRaiding(true)}
                  className="text-black"
                  size="sm"
                  disabled={!countdown.expired}
                  variant={countdown.expired ? 'attack' : 'outline'}
                >
                  Raid Vault
                </Button>
              )}
            </>
          }
          realm={realm}
          loading={false}
          hideLordsClaimable
          showRaidable
        />
      </div>
    </>
  );
};

export default Army;
